import { NextResponse, after } from "next/server";
import { getMotherByTelegram, getMotherByTelegramToken, getMotherByEmail, getMotherByPhone, linkTelegramChat } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { bumplyReply } from "@/lib/companion";
import { sendTelegram, telegramSecret } from "@/lib/telegram";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  // Telegram sends our secret in this header (set via setWebhook secret_token).
  const secret = telegramSecret();
  if (secret && req.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const msg = body.message || body.edited_message;
  const text = String(msg?.text || "").trim();
  const chatId = String(msg?.chat?.id || msg?.from?.id || "");
  if (!chatId || !text) return NextResponse.json({ ok: true });

  after(async () => {
    try {
      let mother = await getMotherByTelegram(chatId);

      // Not linked yet → accept the link code (preferred), or email/phone. Supports /start <code>.
      if (!mother) {
        const candidate = text.replace(/^\/start\s*/i, "").trim();
        let found = await getMotherByTelegramToken(candidate);
        if (!found && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate)) found = await getMotherByEmail(candidate);
        if (!found && /\d{7,}/.test(candidate.replace(/\D/g, ""))) found = await getMotherByPhone(candidate);

        if (found) {
          await linkTelegramChat(found.id, chatId);
          await sendTelegram(chatId, `✓ Linked, ${found.full_name.split(" ")[0]}! 🌸 You can now chat with Bumply here — ask me anything about your pregnancy.`);
        } else {
          await sendTelegram(chatId, "Hi, I'm Bumply 🌸 your pregnancy companion. To connect, open Bumply → Account → Telegram, copy your link code, and paste it here.");
        }
        return;
      }

      const settings = await getSettings();
      if (!settings.chat_enabled) return;

      const reply = await bumplyReply(mother, text);
      const r = await sendTelegram(chatId, reply);
      console.log(`[tg] reply to ${chatId} (${mother.full_name}): sent=${r.sent}${r.error ? ` error=${r.error}` : ""}`);
    } catch (e) {
      console.error("telegram webhook error:", e);
    }
  });

  return NextResponse.json({ ok: true });
}
