// Ambient Deno declaration to prevent local IDE / React tsconfig errors
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Promise<Response> | Response): void;
};

interface WebhookPayload {
  type: string;
  table: string;
  schema: string;
  record: {
    id?: string;
    title?: string;
    slug?: string;
    is_published?: boolean;
    [key: string]: unknown;
  };
}

Deno.serve(async (req: Request) => {
  // Always handle CORS preflight if needed
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  // Security Guard: Verify shared secret header for database webhook origin authentication (fail closed)
  const webhookSecret = Deno.env.get("DATABASE_WEBHOOK_SECRET");
  if (!webhookSecret || !webhookSecret.trim()) {
    console.error("DATABASE_WEBHOOK_SECRET environment secret is missing or blank.");
    return new Response(
      JSON.stringify({ success: false, error: "DATABASE_WEBHOOK_SECRET secret not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const incomingSecret = req.headers.get("X-Webhook-Secret");
  if (!incomingSecret || incomingSecret.trim() !== webhookSecret.trim()) {
    console.warn("Unauthorized webhook request — missing or invalid X-Webhook-Secret header.");
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized: Invalid or missing webhook secret header" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const payload: WebhookPayload = await req.json();
    console.log("Received database webhook payload:", JSON.stringify(payload));

    const { record } = payload || {};

    // Guard clause: Only send broadcast notifications for published authorities
    if (!record || record.is_published !== true) {
      console.log("Authority record is not published. Skipping push notification.");
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: "Authority is not published" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!record.title || !record.slug) {
      console.warn("Authority record missing required title or slug:", record);
      return new Response(
        JSON.stringify({ success: false, error: "Missing title or slug in record payload" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const appId = Deno.env.get("ONESIGNAL_APP_ID") || "76995195-8875-4b55-96e8-dd1004b687e2";
    const apiKey = Deno.env.get("ONESIGNAL_REST_API_KEY");

    if (!apiKey) {
      console.error("ONESIGNAL_REST_API_KEY environment secret is missing.");
      return new Response(
        JSON.stringify({ success: false, error: "ONESIGNAL_REST_API_KEY secret not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Format Authorization header properly for OneSignal API
    const authHeader = apiKey.startsWith("Key ") || apiKey.startsWith("Basic ")
      ? apiKey
      : `Key ${apiKey}`;

    const destinationUrl = `https://www.fhrnigeria.app/authorities/${record.slug}`;

    const notificationPayload = {
      app_id: appId,
      included_segments: ["All"],
      headings: { en: "📜 New Legal Authority Published" },
      contents: { en: record.title },
      url: destinationUrl,
    };

    console.log("Dispatching notification payload to OneSignal:", JSON.stringify(notificationPayload));

    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": authHeader,
      },
      body: JSON.stringify(notificationPayload),
    });

    const resData = await response.json();
    console.log("OneSignal API response:", JSON.stringify(resData));

    if (!response.ok) {
      console.error(`OneSignal HTTP ${response.status} error:`, resData);
      return new Response(
        JSON.stringify({ success: false, status: response.status, oneSignalError: resData }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, notificationId: resData.id, recipients: resData.recipients }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Edge function execution exception:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
