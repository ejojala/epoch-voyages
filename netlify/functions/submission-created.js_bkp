export async function handler(event) {
  try {
    const payload = JSON.parse(event.body); // Netlify form event wrapper
    const data = payload && payload.payload ? payload.payload : payload; // supports manual calls
    const fields = (data && (data.data || data.fields)) || {};

    // 1) Verify Turnstile
    const token = fields["cf-turnstile-response"] || fields["cf-turnstile"] || fields["cf-turnstile-token"];
    if (!token) {
      console.warn("Missing Turnstile token");
      return { statusCode: 400, body: "Missing Turnstile token" };
    }
    const form = new URLSearchParams();
    form.append("secret", process.env.TURNSTILE_SECRET_KEY || "");
    form.append("response", token);
    if (event.headers && event.headers["x-nf-client-connection-ip"])
      form.append("remoteip", event.headers["x-nf-client-connection-ip"]);

    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form
    });
    const verifyJson = await verify.json();
    if (!verifyJson.success) {
      console.error("Turnstile verification failed", verifyJson);
      return { statusCode: 403, body: "Verification failed" };
    }

    // 2) Forward to your Google Apps Script (sends Gmail)
    const url = process.env.APPS_SCRIPT_URL;
    const secret = process.env.APPS_SCRIPT_SECRET;
    if (!url || !secret) {
      console.error("Missing APPS_SCRIPT_URL or APPS_SCRIPT_SECRET");
      return { statusCode: 500, body: "Missing email configuration" };
    }
    const forward = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, payload: data })
    });
    const text = await forward.text();
    console.log("APPS_SCRIPT_RESPONSE", { status: forward.status, text });

    return { statusCode: 200, body: "ok" };
  } catch (e) {
    console.error("submission-created error", e);
    return { statusCode: 500, body: "Server error" };
  }
}
