export async function handler(event) {
  try {
    const outer = JSON.parse(event.body || "{}");
    const data = outer && outer.payload ? outer.payload : outer; // Netlify event or direct POST
    const fields = (data && (data.data || data.fields)) || {};

// --- Turnstile token (normalize array -> string) ---
function pickToken(v) {
  if (Array.isArray(v)) return v.find(Boolean) || "";
  return v || "";
}

const raw =
  fields["cf-turnstile-token"] ??               // our fallback field name
  fields["cf-turnstile-response"] ??            // CF auto-injected hidden field
  fields["cf-turnstile"] ??                     // other variants, just in case
  fields["cf-turnstile-token[]"] ?? null;

const token = pickToken(raw).trim();

if (!token) {
  console.warn("Missing Turnstile token", { rawType: typeof raw, isArray: Array.isArray(raw) });
  return { statusCode: 400, body: "Missing Turnstile token" };
}

// (optional debug for one submission)
// console.log("Turnstile token length:", token.length);

    }

// Verify with Cloudflare
const form = new URLSearchParams();
form.append("secret", process.env.TURNSTILE_SECRET_KEY || "");
form.append("response", token);

const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
  method: "POST",
  body: form,
});
const v = await res.json();
if (!v.success) {
  console.error("Turnstile verification failed", v);
  return { statusCode: 403, body: "Verification failed" }; // IMPORTANT: stop here
}

    // 2) Forward to Apps Script to send the email
    if (!process.env.APPS_SCRIPT_URL || !process.env.APPS_SCRIPT_SECRET) {
      console.error("Missing APPS_SCRIPT_URL or APPS_SCRIPT_SECRET");
      return { statusCode: 500, body: "Missing email configuration" };
    }

    const forward = await fetch(process.env.APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.APPS_SCRIPT_SECRET,
        payload: data,
      }),
    });

    const text = await forward.text();
    console.log("APPS_SCRIPT_RESPONSE", { status: forward.status, text });

    return { statusCode: 200, body: "ok" };
  } catch (e) {
    console.error("submission-created error", e);
    return { statusCode: 500, body: "Server error" };
  }
}
