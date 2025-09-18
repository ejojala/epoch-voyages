import { useEffect, useRef, useState } from "react";

export default function ProposalForm() {
  const page = typeof window !== "undefined" ? window.location.pathname : "/";
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";
  const [token, setToken] = useState("");
  const mountRef = useRef(null);

  useEffect(() => {
    // Ensure Turnstile script is present
    if (!document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.async = true; s.defer = true;
      document.head.appendChild(s);
    }

    // Try to render programmatically once script is ready
    const tryRender = () => {
      const el = mountRef.current;
      if (!el) return;

      // If auto-render already happened (declarative fallback), detect iframe and stop
      if (el.querySelector("iframe")) {
        if (!el.dataset.rendered) el.dataset.rendered = "1";
        return;
      }
      if (!window.turnstile || !siteKey || el.dataset.rendered === "1") return;

      window.turnstile.render(el, {
        sitekey: siteKey,
        theme: "light",
        "refresh-expired": "auto",
        callback: (t) => setToken(t || ""),
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      });
      el.dataset.rendered = "1";
    };

    const id = setInterval(tryRender, 200);
    tryRender();
    return () => clearInterval(id);
  }, [siteKey]);

  return (
    <section style={{ marginTop: 48 }}>
      <h2 style={{ fontSize: 28, margin: "0 0 12px" }}>Start Your Proposal</h2>

      <form
        id="proposal-form"
        name="proposal"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        action="/thanks"
        style={{ display: "grid", gap: 12, maxWidth: 720 }}
      >
        {/* Netlify-required fields */}
        <input type="hidden" name="form-name" value="proposal" />
        <input type="hidden" name="subject" value="New Epoch Voyages inquiry" />
        <input type="hidden" name="page" value={page} />

        {/* Honeypot */}
        <p style={{ display: "none" }} aria-hidden="true">
          <label>
            Don’t fill this out if you’re human:
            <input name="bot-field" autoComplete="off" tabIndex={-1} />
          </label>
        </p>

        <label htmlFor="name">Full name</label>
        <input id="name" name="name" type="text" autoComplete="name" required />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" inputMode="email" required />

        <label htmlFor="destinations">Primary destination(s)</label>
        <input id="destinations" name="destinations" type="text" autoComplete="off" />

        <label htmlFor="dates">Target dates</label>
        <input id="dates" name="dates" type="text" autoComplete="off" placeholder="e.g., May 10–20, 2026" />

        <label htmlFor="travelers">Travelers</label>
        <input id="travelers" name="travelers" type="text" autoComplete="off" placeholder="2 adults, 1 teen" />

        <label htmlFor="interests">Interests</label>
        <textarea id="interests" name="interests" rows="5" placeholder="Art, WWII sites, markets, wine…" />

        {/* Turnstile mount — programmatic render + declarative fallback */}
        <div
          id="turnstile-mount"
          ref={mountRef}
          className="cf-turnstile"
          data-sitekey={siteKey || undefined}
          data-theme="light"
          data-refresh-expired="auto"
        />

        {/* Hidden input that ALWAYS carries the token */}
        <input type="hidden" name="cf-turnstile-response" value={token || ""} />

        <button type="submit" className="cta" style={{ width: "fit-content" }} disabled={!token}>
          Send request
        </button>

        {!token && <small style={{ color: "#666" }}>Please complete the verification above to enable Send.</small>}
      </form>
    </section>
  );
}
