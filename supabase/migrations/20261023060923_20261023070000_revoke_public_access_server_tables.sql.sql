/*
# Fix: Revoke anon/authenticated access on server-only tables

## Problem
The security advisor found that kiwify_entitlements, kiwify_events, and premium_prompts
have grants to anon and authenticated roles, despite being intended as service_role-only.
This is a critical security issue: premium_prompts contains paid content that anyone could
read directly via the Data API, bypassing the get_premium_prompt() SECURITY DEFINER function.

## Changes
1. Revoke ALL privileges from anon and authenticated on kiwify_entitlements, kiwify_events,
   and premium_prompts.
2. Ensure service_role retains full access.
3. Add deny-all RLS policies on these tables so even if a grant leaks again, RLS blocks access.

## Security
- kiwify_entitlements: service_role only (edge function writes entitlements)
- kiwify_events: service_role only (edge function writes audit events)
- premium_prompts: service_role only (content served via get_premium_prompt RPC)
- These tables have RLS enabled with no policies for anon/authenticated = fully locked down.
*/

-- Revoke all access from anon and authenticated on server-only tables
REVOKE ALL ON kiwify_entitlements FROM anon, authenticated;
REVOKE ALL ON kiwify_events FROM anon, authenticated;
REVOKE ALL ON premium_prompts FROM anon, authenticated;

-- Ensure service_role keeps full access
GRANT ALL ON kiwify_entitlements TO service_role;
GRANT ALL ON kiwify_events TO service_role;
GRANT ALL ON premium_prompts TO service_role;

-- Add explicit deny policies (RLS with no matching policy = no access, but being explicit)
DROP POLICY IF EXISTS "deny_all_kiwify_entitlements" ON kiwify_entitlements;
CREATE POLICY "deny_all_kiwify_entitlements"
  ON kiwify_entitlements FOR SELECT
  TO anon, authenticated
  USING (false);

DROP POLICY IF EXISTS "deny_all_kiwify_events" ON kiwify_events;
CREATE POLICY "deny_all_kiwify_events"
  ON kiwify_events FOR SELECT
  TO anon, authenticated
  USING (false);

DROP POLICY IF EXISTS "deny_all_premium_prompts" ON premium_prompts;
CREATE POLICY "deny_all_premium_prompts"
  ON premium_prompts FOR SELECT
  TO anon, authenticated
  USING (false);
