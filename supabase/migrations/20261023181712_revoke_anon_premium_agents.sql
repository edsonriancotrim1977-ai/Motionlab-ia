/*
# Revoke anon privileges from premium_agents

The default Supabase schema grants gave anon SELECT/INSERT/UPDATE/DELETE
on premium_agents. RLS already blocks anon from seeing any rows (no anon
policy exists), but we revoke the grants entirely for defense-in-depth.
*/

REVOKE SELECT, INSERT, UPDATE, DELETE ON premium_agents FROM anon;
