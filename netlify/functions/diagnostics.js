export async function handler() {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    body: JSON.stringify({
      ok: true,
      cfg: {
        TURNSTILE_SECRET_KEY: !!process.env.TURNSTILE_SECRET_KEY,
        APPS_SCRIPT_URL: !!process.env.APPS_SCRIPT_URL,
        APPS_SCRIPT_SECRET: !!process.env.APPS_SCRIPT_SECRET
      },
      ts: new Date().toISOString()
    }),
  };
}
