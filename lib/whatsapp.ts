import { evolutionConfigured, sendText } from "./evolution";

// WhatsApp now runs on a self-hosted Evolution API (v2). This keeps the original
// sendWhatsApp()/whatsappConfigured() surface so weeklyJob and callers are unchanged.
export function whatsappConfigured(): boolean {
  return evolutionConfigured();
}

export async function sendWhatsApp(
  to: string,
  body: string
): Promise<{ sent: boolean; skipped?: boolean; error?: string }> {
  if (!whatsappConfigured()) return { sent: false, skipped: true };
  const r = await sendText(to, body);
  return r.ok ? { sent: true } : { sent: false, error: r.error };
}
