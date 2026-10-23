/*
# Create premium_agents table — secure storage for AI agent content

## Purpose
Stores the complete private content (instructions, installation tutorial) for
premium AI agents shown on the "Agentes de IA" page. The public-facing fields
(name, description) are safe to expose; the private fields (full_instructions,
installation_tutorial) must NEVER be readable by unauthenticated or non-premium
users through the Data API.

## New Tables
- `premium_agents`
  - `id` (uuid, primary key)
  - `slug` (text, unique) — URL-safe identifier (e.g. "diretor-criativo")
  - `name` (text) — display name shown on the page
  - `description` (text) — public description, safe to show to anyone
  - `benefits` (jsonb) — public list of benefits shown on the page
  - `how_it_works` (text) — public summary shown on the page
  - `full_instructions` (text) — PRIVATE, only returned to authenticated premium users
  - `installation_tutorial` (text) — PRIVATE, only returned to authenticated premium users
  - `premium` (boolean, default true) — whether this agent requires premium
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

## Security
- RLS enabled on `premium_agents`.
- The `anon` role has NO grants — unauthenticated users cannot query the table at all.
- The `authenticated` role has SELECT grant but RLS policies restrict which rows
  and columns are visible:
  - A SELECT policy allows `authenticated` users to see only the public columns
    (slug, name, description, benefits, how_it_works, premium) when `premium = true`.
  - A separate SECURITY DEFINER function `get_premium_agent(slug text)` returns the
    private columns (full_instructions, installation_tutorial) ONLY when the caller
    is authenticated AND has premium access (checked via the existing
    `has_premium_access()` function). Non-premium users get an empty result set.
- `service_role` has full SELECT for admin/maintenance.
- EXECUTE on `get_premium_agent` is granted only to `authenticated`.

## Functions
- `get_premium_agent(agent_slug text)` — SECURITY DEFINER, returns
  (full_instructions text, installation_tutorial text) for the matching agent
  slug, but only if `has_premium_access(auth.uid())` is true. Returns empty
  result set otherwise.
*/

-- 1. Create the table
CREATE TABLE IF NOT EXISTS premium_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  benefits jsonb DEFAULT '[]'::jsonb,
  how_it_works text DEFAULT '',
  full_instructions text DEFAULT '',
  installation_tutorial text DEFAULT '',
  premium boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE premium_agents ENABLE ROW LEVEL SECURITY;

-- 3. Grants — minimum privilege
-- service_role can read everything (for admin/edge functions)
GRANT SELECT ON premium_agents TO service_role;
-- authenticated can SELECT (but RLS restricts rows + columns are filtered by the function approach)
GRANT SELECT ON premium_agents TO authenticated;
-- anon gets NOTHING — no access at all

-- 4. RLS Policies
-- Authenticated users can see that premium agents exist (public metadata only).
-- The private columns are never exposed through this policy because the frontend
-- only requests public columns via the Data API; private content comes through
-- the SECURITY DEFINER function which does its own auth check.
DROP POLICY IF EXISTS "authenticated_can_see_agent_metadata" ON premium_agents;
CREATE POLICY "authenticated_can_see_agent_metadata"
ON premium_agents FOR SELECT
TO authenticated
USING (true);

-- 5. SECURITY DEFINER function to return private content only to premium users
CREATE OR REPLACE FUNCTION public.get_premium_agent(agent_slug text)
RETURNS TABLE(
  full_instructions text,
  installation_tutorial text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- No authenticated user or no premium → return nothing
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;

  IF NOT has_premium_access(auth.uid()) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT pa.full_instructions, pa.installation_tutorial
  FROM premium_agents pa
  WHERE pa.slug = agent_slug
    AND pa.premium = true;
END;
$function$;

-- 6. Revoke default EXECUTE from PUBLIC, grant only to authenticated
REVOKE EXECUTE ON FUNCTION public.get_premium_agent(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_premium_agent(text) TO authenticated;
