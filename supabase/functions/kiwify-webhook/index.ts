import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const kiwifyToken = Deno.env.get("KIWIFY_WEBHOOK_TOKEN")!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const rawBody = await req.text();

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Validate Kiwify webhook token (if configured)
    // Kiwify may send the token in the Authorization header, a custom header,
    // a query parameter, or inside the request body as "token".
    if (kiwifyToken) {
      const authHeader = req.headers.get("Authorization") || "";
      const headerToken = authHeader.replace(/^Bearer\s+/i, "").trim();
      const customHeaderToken = req.headers.get("X-Kiwify-Token") || "";
      const url = new URL(req.url);
      const queryToken = url.searchParams.get("token") || "";
      const bodyToken = String((payload as Record<string, unknown>).token || "");

      const providedToken =
        headerToken || customHeaderToken || queryToken || bodyToken;

      if (providedToken !== kiwifyToken) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    // Extract event type and identifiers
    const eventType = String(
      payload.event_type ||
        payload.type ||
        payload.event ||
        "unknown",
    );

    // Kiwify sends different structures; extract common fields
    const customerEmail = normalizeEmail(
      String(
        payload.customer_email ||
          payload.email ||
          (payload.customer && payload.customer.email) ||
          (payload.data && payload.data.customer_email) ||
          "",
      ),
    );

    const orderId = String(
      payload.order_id ||
        payload.id ||
        payload.transaction_id ||
        (payload.data && payload.data.order_id) ||
        "",
    );

    const transactionId = String(
      payload.transaction_id ||
        payload.order_id ||
        (payload.data && payload.data.transaction_id) ||
        orderId,
    );

    // Unique event id for idempotency
    const eventId = String(
      payload.event_id ||
        payload.webhook_id ||
        `${orderId}-${eventType}-${Date.now()}`,
    );

    if (!customerEmail) {
      return new Response(
        JSON.stringify({ error: "Missing customer email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Idempotency: check if this event was already processed
    const { data: existingEvent } = await supabase
      .from("kiwify_events")
      .select("id, status")
      .eq("event_id", eventId)
      .maybeSingle();

    if (existingEvent) {
      return new Response(
        JSON.stringify({ status: "duplicate", message: "Event already processed" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Determine if this is an approval or refund/chargeback
    const eventTypeLower = eventType.toLowerCase();
    const isRefund = /refund|chargeback|reversal|cancel/i.test(eventTypeLower);
    const isApproval = /approved|paid|completed|confirmed|authorized/i.test(eventTypeLower);

    // Ignore non-actionable events (pix generated, boleto generated, cart abandoned, etc.)
    if (!isRefund && !isApproval) {
      await supabase.from("kiwify_events").insert({
        event_id: eventId,
        event_type: eventType,
        email: customerEmail,
        status: "processed",
        payload,
      });
      return new Response(
        JSON.stringify({ status: "ignored", message: `Event type '${eventType}' not actionable` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (isApproval) {
      // Upsert entitlement
      const { error: entError } = await supabase
        .from("kiwify_entitlements")
        .upsert(
          {
            email: customerEmail,
            plan: "premium",
            premium_active: true,
            kiwify_order_id: orderId,
            kiwify_transaction_id: transactionId,
            status: "active",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "email" },
        );

      if (entError) {
        console.error("Entitlement upsert error:", entError);
      }

      // Try to find existing user profile and upgrade
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, email, plan, premium_active")
        .eq("email", customerEmail)
        .maybeSingle();

      if (profile) {
        await supabase
          .from("profiles")
          .update({
            plan: "premium",
            premium_active: true,
            premium_since: new Date().toISOString(),
            kiwify_order_id: orderId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id);
      }
    } else if (isRefund) {
      // Revoke entitlement
      await supabase
        .from("kiwify_entitlements")
        .update({
          premium_active: false,
          status: "revoked",
          updated_at: new Date().toISOString(),
        })
        .eq("email", customerEmail);

      // Downgrade user profile if no other active entitlement
      const { data: activeEnt } = await supabase
        .from("kiwify_entitlements")
        .select("id")
        .eq("email", customerEmail)
        .eq("premium_active", true)
        .eq("status", "active")
        .maybeSingle();

      if (!activeEnt) {
        await supabase
          .from("profiles")
          .update({
            plan: "free",
            premium_active: false,
            updated_at: new Date().toISOString(),
          })
          .eq("email", customerEmail);
      }
    }

    // Record event for audit
    await supabase.from("kiwify_events").insert({
      event_id: eventId,
      event_type: eventType,
      email: customerEmail,
      status: "processed",
      payload,
    });

    return new Response(
      JSON.stringify({ status: "ok", action: isRefund ? "revoked" : "activated" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
