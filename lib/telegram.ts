// Telegram Bot API client — reliable two-way chat (no QR / no soft-bans).
const TOKEN = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
const API = `https://api.telegram.org/bot${TOKEN}`;

export function telegramConfigured(): boolean {
  return !!TOKEN;
}

export function telegramBotUsername(): string {
  return process.env.TELEGRAM_BOT_USERNAME || "bumply_bot";
}

export function telegramSecret(): string {
  return process.env.TELEGRAM_WEBHOOK_SECRET || process.env.WHATSAPP_WEBHOOK_SECRET || process.env.CRON_SECRET || "";
}

export function telegramWebhookUrl(): string {
  const base = (process.env.PUBLIC_WEBHOOK_URL || process.env.APP_URL || "").replace(/\/+$/, "");
  return `${base}/api/telegram/webhook`;
}

async function tg(method: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
  if (!telegramConfigured()) return { ok: false, description: "not configured" };
  try {
    const r = await fetch(`${API}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    return (await r.json()) as Record<string, unknown>;
  } catch (e) {
    return { ok: false, description: e instanceof Error ? e.message : "request failed" };
  }
}

export async function getMe(): Promise<Record<string, unknown>> {
  return tg("getMe", {});
}

export async function sendTelegram(chatId: string | number, text: string): Promise<{ sent: boolean; error?: string }> {
  const d = await tg("sendMessage", { chat_id: chatId, text });
  return { sent: !!d.ok, error: d.ok ? undefined : String(d.description || "") };
}

export async function setTelegramWebhook(): Promise<Record<string, unknown>> {
  return tg("setWebhook", {
    url: telegramWebhookUrl(),
    secret_token: telegramSecret() || undefined,
    allowed_updates: ["message"],
    drop_pending_updates: true,
  });
}

export async function getWebhookInfo(): Promise<Record<string, unknown>> {
  return tg("getWebhookInfo", {});
}
