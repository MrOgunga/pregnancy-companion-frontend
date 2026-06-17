// Runs once when the server starts. On a real deploy (https public URL), it
// auto-registers the Telegram webhook so two-way chat works with no manual step.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  try {
    const { telegramConfigured, setTelegramWebhook, telegramWebhookUrl } = await import("./lib/telegram");
    const { isPublicHttps } = await import("./lib/baseUrl");
    const url = telegramWebhookUrl();
    if (telegramConfigured() && isPublicHttps(url)) {
      const r = await setTelegramWebhook();
      console.log("[startup] Telegram webhook →", url, JSON.stringify(r).slice(0, 100));
    }
  } catch (e) {
    console.error("[startup] telegram webhook setup failed:", e);
  }
}
