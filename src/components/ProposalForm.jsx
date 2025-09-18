import { useEffect } from "react";

export default function ProposalForm() {
  // Add the current page for context (works in React)
  const page = typeof window !== "undefined" ? window.location.pathname : "/";

  // Ensure Turnstile script is present in dev too
  useEffect(() => {
    if (!window.turnstile && !document.querySelector('script[src*="turnstile"]')) {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.async = true; s.defer = true;
      document.head.appendChild(s);
    }
  }, []);

  return (
    <section style={{marginTop: 48}}>
      <h2 style={{fontSize: 28, margin: "0 0 12px"}}>Start Your Proposal</h2>
      <form
        name="proposal"
        method="POST"
		action="/thanks"
        data-netlify="true"
        netlify-honeypot="bot-field"
        style={{display:"grid", gap:12, maxWidth: 720}}
      >
        {/* Required by Netlify */}
        <input type="hidden" name="form-name" value="proposal" />
        <input type="hidden" name="subject" value="New Epoch Voyages inquiry" />
        <input type="hidden" name="page" value={page} />

        {/* Honeypot */}
        <p className="hidden" aria-hidden="true" style={{display:"none"}}>
          <label>Don’t fill this out if you’re human: <input name="bot-field" autoComplete="off" tabIndex={-1} /></label>
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

        {/* Cloudflare Turnstile */}
        <div
          className="cf-turnstile"
          data-sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
          data-theme="light"
        />

        <button type="submit" className="cta" style={{width:"fit-content"}}>Send request</button>
      </form>
    </section>
  );
}
