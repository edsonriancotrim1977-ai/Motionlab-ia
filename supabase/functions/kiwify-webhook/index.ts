import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
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

async function hmacSha1Hex(
  message: string,
  secret: string,
): Promise<string> {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-1",
    },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message),
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let result = 0;

  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const rawBody = await req.text();

    let payload: any;

    try {
      payload = JSON.parse(rawBody);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // ---------------------------------------------------------
    // VALIDAR ASSINATURA OFICIAL DA KIWIFY
    // ---------------------------------------------------------

    if (!kiwifyToken) {
      console.error("KIWIFY_WEBHOOK_TOKEN is not configured");

      return new Response(
        JSON.stringify({ error: "Webhook secret not configured" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const url = new URL(req.url);

    // A Kiwify normalmente envia a assinatura como ?signature=
    // Também aceitamos o header como fallback.
    const receivedSignature = (
      url.searchParams.get("signature") ||
      req.headers.get("X-Kiwify-Signature") ||
      ""
    )
      .trim()
      .toLowerCase();

    if (!receivedSignature) {
      console.error("Kiwify signature missing");

      return new Response(
        JSON.stringify({ error: "Missing Kiwify signature" }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Formato documentado pela Kiwify:
    // HMAC-SHA1 de JSON.stringify(body)
    const normalizedBody = JSON.stringify(payload);

    const normalizedSignature = await hmacSha1Hex(
      normalizedBody,
      kiwifyToken,
    );

    // Fallback para implementações que assinam o corpo cru.
    const rawSignature = await hmacSha1Hex(
      rawBody,
      kiwifyToken,
    );

    const validSignature =
      safeEqual(receivedSignature, normalizedSignature) ||
      safeEqual(receivedSignature, rawSignature);

    if (!validSignature) {
      console.error("Invalid Kiwify signature");

      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // ---------------------------------------------------------
    // EXTRAIR DADOS DA KIWIFY
    // ---------------------------------------------------------

    const eventType = String(
      payload.webhook_event_type ||
        payload.event_type ||
        payload.type ||
        payload.event ||
        payload.order_status ||
        "unknown",
    );

    const customerEmail = normalizeEmail(
      String(
        payload.Customer?.email ||
          payload.customer?.email ||
          payload.customer_email ||
          payload.email ||
          payload.data?.customer_email ||
          payload.data?.Customer?.email ||
          "",
      ),
    );

    const orderId = String(
      payload.order_id ||
        payload.id ||
        payload.transaction_id ||
        payload.data?.order_id ||
        "",
    );

    const transactionId = String(
      payload.transaction_id ||
        payload.order_id ||
        payload.data?.transaction_id ||
        orderId,
    );

    const eventId = String(
      payload.event_id ||
        payload.webhook_id ||
        `${orderId}-${eventType}`,
    );

    const eventTypeLower = eventType.toLowerCase();

    // Eventos que removem acesso
    const isRefund =
      /order_refunded|chargeback|subscription_canceled|subscription_cancelled|refund|reversal|cancel/i
        .test(eventTypeLower);

    // Eventos que liberam/mantêm acesso
    const isApproval =
      /order_approved|subscription_renewed|approved|paid|completed|confirmed|authorized|renewed/i
        .test(eventTypeLower);

    // Eventos que não alteram o acesso
    if (!isRefund && !isApproval) {
      if (customerEmail) {
        await supabase.from("kiwify_events").insert({
          event_id: eventId,
          event_type: eventType,
          email: customerEmail,
          status: "processed",
          payload,
        });
      }

      return new Response(
        JSON.stringify({
          status: "ignored",
          message: `Event type '${eventType}' not actionable`,
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    if (!customerEmail) {
      return new Response(
        JSON.stringify({ error: "Missing customer email" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // ---------------------------------------------------------
    // EVITAR PROCESSAMENTO DUPLICADO
    // ---------------------------------------------------------

    const { data: existingEvent } = await supabase
      .from("kiwify_events")
      .select("id, status")
      .eq("event_id", eventId)
      .maybeSingle();

    if (existingEvent) {
      return new Response(
        JSON.stringify({
          status: "duplicate",
          message: "Event already processed",
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // ---------------------------------------------------------
    // COMPRA APROVADA / ASSINATURA RENOVADA
    // ---------------------------------------------------------

    if (isApproval) {
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
          {
            onConflict: "email",
          },
        );

      if (entError) {
        console.error("Entitlement upsert error:", entError);
        throw entError;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, email, plan, premium_active")
        .eq("email", customerEmail)
        .maybeSingle();

      if (profile) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            plan: "premium",
            premium_active: true,
            premium_since: new Date().toISOString(),
            kiwify_order_id: orderId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id);

        if (profileError) {
          console.error("Profile update error:", profileError);
          throw profileError;
        }
      }
    }

    // ---------------------------------------------------------
    // REEMBOLSO / CHARGEBACK / CANCELAMENTO
    // ---------------------------------------------------------

    if (isRefund) {
      const { error: revokeError } = await supabase
        .from("kiwify_entitlements")
        .update({
          premium_active: false,
          status: "revoked",
          updated_at: new Date().toISOString(),
        })
        .eq("email", customerEmail);

      if (revokeError) {
        console.error("Entitlement revoke error:", revokeError);
        throw revokeError;
      }

      const { data: activeEnt } = await supabase
        .from("kiwify_entitlements")
        .select("id")
        .eq("email", customerEmail)
        .eq("premium_active", true)
        .eq("status", "active")
        .maybeSingle();

      if (!activeEnt) {
        const { error: downgradeError } = await supabase
          .from("profiles")
          .update({
            plan: "free",
            premium_active: false,
            updated_at: new Date().toISOString(),
          })
          .eq("email", customerEmail);

        if (downgradeError) {
          console.error("Profile downgrade error:", downgradeError);
          throw downgradeError;
        }
      }
    }

    // ---------------------------------------------------------
    // REGISTRAR EVENTO
    // ---------------------------------------------------------

    const { error: eventError } = await supabase
      .from("kiwify_events")
      .insert({
        event_id: eventId,
        event_type: eventType,
        email: customerEmail,
        status: "processed",
        payload,
      });

    if (eventError) {
      console.error("Event insert error:", eventError);
      throw eventError;
    }

    return new Response(
      JSON.stringify({
        status: "ok",
        action: isRefund ? "revoked" : "activated",
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err) {
    console.error("Webhook error:", err);

    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});

