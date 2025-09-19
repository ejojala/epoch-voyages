// netlify/functions/submission-created.js
exports.handler = async (event) => {
  try {
    const outer = JSON.parse(event.body || "{}");
    const data = outer && outer.payload ? outer.payload : outer; // Netlify event OR direct POST
    const fields = (data && (data.data || data.fields)) || {};

    // --- Turnstile token (normalize array -> single string) ---
    const pickToken = (v) => (Array.isArray(v) ? (v.find(Boolean) || "") : (v || ""));

    const raw =
      fields["cf-turnstile-token"] ??            // our fallback hidden field
      fields["cf-turnstile-response"] ??         // CF auto-injected hidden field
      fields["cf-turnstile"] ?? null;

    const token = pickToken(raw).trim();
    if (!token) {
      console.warn("Missing Turnstile token", { rawType: typeof raw, isArray: Array.isArray(raw) });
      return { statusCode: 400, body: "Missing Turnstile token" };
    }

    // Verify with Cloudflare Turnstile
    const form = new URLSearchParams();
    form.append("secret", process.env.TURNSTILE_SECRET_KEY || "");
    form.append("response", token);

    const clientIp = event.headers?.["x-nf-client-connection-ip"] || event.headers?.["client-ip"];
    if (clientIp) form.append("remoteip", clientIp);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    const verify = await res.json();
    if (!verify.success) {
      console.error("Turnstile verification failed", verify);
      return { statusCode: 403, body: "Verification failed" }; // stop here if captcha fails
    }

    // Forward to Apps Script to send the email
    const url = process.env.APPS_SCRIPT_URL;
    const secret = process.env.APPS_SCRIPT_SECRET;
    if (!url || !secret) {
      console.error("Missing APPS_SCRIPT_URL or APPS_SCRIPT_SECRET");
      return { statusCode: 500, body: "Missing email configuration" };
    }

    const forward = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, payload: data }),
    });

    const text = await forward.text();
    console.log("APPS_SCRIPT_RESPONSE", { status: forward.status, text });

    return { statusCode: 200, body: "ok" };
  } catch (e) {
    console.error("submission-created error", e);
    return { statusCode: 500, body: "Server error" };
  }
};
