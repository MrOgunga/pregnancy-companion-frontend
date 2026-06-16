export function whatsappConfigured(): boolean {
  return !!(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_ID);
}

// Sends a plain-text WhatsApp message via the Meta Cloud API.
export async function sendWhatsApp(
  to: string,
  body: string
): Promise<{ sent: boolean; skipped?: boolean; error?: string }> {
  if (!whatsappConfigured()) return { sent: false, skipped: true };
  const phone = to.replace(/[^\d]/g, "");
  if (!phone) return { sent: false, error: "no phone number" };
  try {
    const res = await fetch(`https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", to: phone, type: "text", text: { body } }),
    });
    if (!res.ok) return { sent: false, error: `HTTP ${res.status}` };
    return { sent: true };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : "send failed" };
  }
}
