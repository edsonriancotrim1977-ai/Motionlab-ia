/*
# Revoke EXECUTE on trigger function apply_entitlement_on_signup

## Problem
The security advisor flagged apply_entitlement_on_signup() as a SECURITY DEFINER function
callable by authenticated users via /rest/v1/rpc. This function is a trigger (fires on
auth.users INSERT) and should never be called directly via the API.

## Change
Revoke EXECUTE from authenticated role. The function is only invoked by the database trigger,
not by any client.
*/

REVOKE EXECUTE ON FUNCTION apply_entitlement_on_signup() FROM authenticated;
