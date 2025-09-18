import React, { useEffect, useState } from "react";
export default function DevStatus() {
  const [diag, setDiag] = useState({ tried: false, ok: null, detail: "" });
  const isDev = import.meta.env.DEV;
  const mode = import.meta.env.MODE;
  const siteKeyPresent = !!import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const host = typeof window !== "undefined" ? window.location.host : "";
  React.useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 5000);
    fetch("/.netlify/functions/diagnostics", { signal: controller.signal, headers: { "Cache-Control": "no-store" } })
      .then(async (r) => { const text = await r.text(); if (!cancelled) setDiag({ tried: true, ok: r.ok, detail: text.slice(0, 400) }); })
      .catch((e) => { if (!cancelled) setDiag({ tried: true, ok: false, detail: String(e.message || e) }); })
      .finally(() => clearTimeout(t));
    return () => { cancelled = true; clearTimeout(t); controller.abort(); };
  }, []);
  const turnstileLoaded = typeof window !== "undefined" && !!window.turnstile;
  const pill = (txt, good) => <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 11, background: good ? "#e6f6ed" : "#fdecea", color: good ? "#10693e" : "#8a1f11", border: `1px solid ${good ? "#b7ebcd" : "#f5c6c0"}`, }}>{txt}</span>;
  const show = import.meta.env.DEV || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug'));
  if(!show) return null;
  return (<div style={{ position: "fixed", bottom: 12, left: 12, zIndex: 9999, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif", fontSize: 12, background: "rgba(255,255,255,0.96)", border: "1px solid #e2e2e2", boxShadow: "0 6px 22px rgba(0,0,0,0.12)", borderRadius: 12, padding: 12, minWidth: 280, maxWidth: 360, }}>
    <div style={{ fontWeight: 600, marginBottom: 6 }}>Dev Status</div>
    <div style={{ display: "grid", gap: 6 }}>
      <div>Mode: {pill(isDev ? "Vite dev" : mode, isDev)}</div>
      <div>Host: <code>{host}</code></div>
      <div>Turnstile site key: {pill(siteKeyPresent ? "present" : "missing", siteKeyPresent)}</div>
      <div>Turnstile script loaded: {pill(turnstileLoaded ? "yes" : "no", turnstileLoaded)}</div>
      <div>Functions /diagnostics: {diag.tried ? (<>{pill(diag.ok ? "OK" : "ERROR", !!diag.ok)} {!diag.ok && (<details style={{ marginTop: 4 }}><summary style={{ cursor: "pointer" }}>details</summary><pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{diag.detail}</pre></details>)} </>) : ("checking…")}</div>
      <div style={{ color: "#666" }}>Tip: add <code>?debug=1</code> to show this in production.</div>
    </div>
  </div>);
}
