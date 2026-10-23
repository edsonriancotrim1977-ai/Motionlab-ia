/*
# MotionLab AI — Auth, Premium Access & Kiwify Integration

## Overview
Creates the full backend for user authentication, premium access control, Kiwify webhook processing, and per-user favorites.

## 1. New Tables

### profiles
- `id` (uuid, PK, FK to auth.users)
- `email` (text, unique)
- `plan` (text: 'free' | 'premium', default 'free')
- `premium_active` (boolean, default false)
- `premium_since` (timestamptz, nullable)
- `kiwify_order_id` (text, nullable)
- `created_at` (timestamptz, default now)
- `updated_at` (timestamptz, default now)

### kiwify_entitlements
Stores pending or active entitlements keyed by email. When a user buys before creating an account, the entitlement waits here and is applied on signup.
- `id` (uuid, PK)
- `email` (text, unique — normalized lowercase)
- `plan` (text: 'free' | 'premium', default 'premium')
- `premium_active` (boolean, default true)
- `kiwify_order_id` (text, nullable)
- `kiwify_transaction_id` (text, nullable)
- `status` (text: 'active' | 'revoked', default 'active')
- `created_at` (timestamptz, default now)
- `updated_at` (timestamptz, default now)

### kiwify_events
Audit log for idempotency — every webhook event is stored here with its raw payload and processing status.
- `id` (uuid, PK)
- `event_id` (text, unique — Kiwify's unique event/transaction id)
- `event_type` (text)
- `email` (text)
- `status` (text: 'processed' | 'duplicate' | 'error')
- `payload` (jsonb)
- `created_at` (timestamptz, default now)

### premium_prompts
Stores premium prompt content that must NEVER be sent to non-premium users. The frontend shows locked cards but fetches the actual prompt text only after the server confirms premium access.
- `id` (uuid, PK)
- `prompt_id` (text, unique — matches the Prompt.id from the static library)
- `prompt_text` (text)
- `take_prompts` (jsonb, nullable — array of {take, duration, title, prompt})
- `created_at` (timestamptz, default now)

### favorites
Per-user favorites, replacing localStorage for authenticated users.
- `id` (uuid, PK)
- `user_id` (uuid, FK to auth.users, NOT NULL, DEFAULT auth.uid())
- `prompt_id` (text, NOT NULL)
- `created_at` (timestamptz, default now)
- UNIQUE(user_id, prompt_id)

## 2. Functions

### has_premium_access(user_uuid)
SECURITY DEFINER function that returns true if the given user has premium_active = true in profiles. Used by the get_premium_prompt function.

### get_premium_prompt(prompt_id_text)
SECURITY DEFINER function that checks if the calling user (auth.uid()) has premium access. If yes, returns the prompt_text and take_prompts from premium_prompts. If no, returns null. This ensures premium content never reaches unauthorized browsers.

### apply_entitlement_on_signup()
SECURITY DEFINER trigger function that fires AFTER INSERT on auth.users. Creates a profile row and, if a kiwify_entitlement exists for that email, activates premium on the new profile.

## 3. Security (RLS)

- profiles: user can SELECT/UPDATE only their own row. Cannot change plan or premium_active (column-level: UPDATE granted only on updated_at).
- kiwify_entitlements: no direct access to anon/authenticated — only service_role (edge function).
- kiwify_events: no direct access to anon/authenticated — only service_role.
- premium_prompts: no direct SELECT/INSERT/UPDATE/DELETE to anon/authenticated. Content is accessed only through get_premium_prompt() SECURITY DEFINER function.
- favorites: user can CRUD only their own favorites.

## 4. Notes
- The trigger on auth.users handles automatic profile creation and entitlement application on signup.
- kiwify_entitlements and kiwify_events are service_role-only to prevent any client-side tampering.
- premium_prompts is service_role-only; the get_premium_prompt function is the sole gateway.
- profiles UPDATE is column-restricted: users can only update updated_at, NOT plan or premium_active.
*/

-- ============================================================
-- 1. profiles table
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  premium_active boolean NOT NULL DEFAULT false,
  premium_since timestamptz,
  kiwify_order_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON profiles TO authenticated;
GRANT UPDATE (updated_at) ON profiles TO authenticated;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- 2. kiwify_entitlements table
-- ============================================================
CREATE TABLE IF NOT EXISTS kiwify_entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  plan text NOT NULL DEFAULT 'premium' CHECK (plan IN ('free', 'premium')),
  premium_active boolean NOT NULL DEFAULT true,
  kiwify_order_id text,
  kiwify_transaction_id text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE kiwify_entitlements ENABLE ROW LEVEL SECURITY;
-- No grants to anon or authenticated — only service_role can access
GRANT ALL ON kiwify_entitlements TO service_role;

-- ============================================================
-- 3. kiwify_events table
-- ============================================================
CREATE TABLE IF NOT EXISTS kiwify_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text UNIQUE,
  event_type text,
  email text,
  status text NOT NULL DEFAULT 'processed',
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE kiwify_events ENABLE ROW LEVEL SECURITY;
GRANT ALL ON kiwify_events TO service_role;

-- ============================================================
-- 4. premium_prompts table
-- ============================================================
CREATE TABLE IF NOT EXISTS premium_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id text UNIQUE NOT NULL,
  prompt_text text NOT NULL,
  take_prompts jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE premium_prompts ENABLE ROW LEVEL SECURITY;
-- No grants to anon or authenticated — only service_role
GRANT ALL ON premium_prompts TO service_role;

-- ============================================================
-- 5. favorites table
-- ============================================================
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, prompt_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON favorites TO authenticated;

DROP POLICY IF EXISTS "select_own_favorites" ON favorites;
CREATE POLICY "select_own_favorites" ON favorites FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_favorites" ON favorites;
CREATE POLICY "insert_own_favorites" ON favorites FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_favorites" ON favorites;
CREATE POLICY "update_own_favorites" ON favorites FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_favorites" ON favorites;
CREATE POLICY "delete_own_favorites" ON favorites FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- 6. Functions
-- ============================================================

-- has_premium_access: check if a user has premium
CREATE OR REPLACE FUNCTION has_premium_access(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT premium_active FROM profiles WHERE id = user_uuid),
    false
  );
$$;

REVOKE EXECUTE ON FUNCTION has_premium_access(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION has_premium_access(uuid) TO authenticated;

-- get_premium_prompt: returns premium prompt content only if caller has premium
CREATE OR REPLACE FUNCTION get_premium_prompt(prompt_id_text text)
RETURNS TABLE(prompt_text text, take_prompts jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_premium_access(auth.uid()) THEN
    RETURN;
  END IF;
  RETURN QUERY
    SELECT pp.prompt_text, pp.take_prompts
    FROM premium_prompts pp
    WHERE pp.prompt_id = prompt_id_text;
END;
$$;

REVOKE EXECUTE ON FUNCTION get_premium_prompt(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION get_premium_prompt(text) TO authenticated;

-- ============================================================
-- 7. Trigger: auto-create profile + apply entitlement on signup
-- ============================================================

CREATE OR REPLACE FUNCTION apply_entitlement_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ent kiwify_entitlements%ROWTYPE;
BEGIN
  -- Create profile
  INSERT INTO profiles (id, email, plan, premium_active)
  VALUES (NEW.id, LOWER(NEW.email), 'free', false)
  ON CONFLICT (id) DO NOTHING;

  -- Check for pending entitlement
  SELECT * INTO ent FROM kiwify_entitlements
  WHERE email = LOWER(NEW.email) AND status = 'active' AND premium_active = true
  LIMIT 1;

  IF FOUND THEN
    UPDATE profiles
    SET plan = 'premium',
        premium_active = true,
        premium_since = now(),
        kiwify_order_id = ent.kiwify_order_id,
        updated_at = now()
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION apply_entitlement_on_signup() FROM PUBLIC, anon;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION apply_entitlement_on_signup();
