import { Resend } from "resend";
import { readFile } from "node:fs/promises";
import path from "node:path";

export function emailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

let client: Resend | null = null;
function getClient(): Resend | null {
  if (!emailConfigured()) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY!);
  return client;
}

export type EmailAttachment = { filename: string; content: Buffer; contentId?: string };

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  attachments?: EmailAttachment[]
): Promise<{ sent: boolean; skipped?: boolean; error?: string; id?: string }> {
  const c = getClient();
  if (!c) return { sent: false, skipped: true };
  try {
    const { data, error } = await c.emails.send({
      from: process.env.EMAIL_FROM || "Bumply <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
      attachments: attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentId: a.contentId,
      })),
    });
    if (error) return { sent: false, error: error.message };
    return { sent: true, id: data?.id };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : "send failed" };
  }
}

// Reads a /public/baby image into a Buffer for inline (cid) email embedding.
export async function readPublicImage(file: string): Promise<Buffer> {
  return readFile(path.join(process.cwd(), "public", "baby", file));
}

// Warm onboarding email sent right after signup (env-gated, non-blocking).
export function buildWelcomeHtml(name: string, week: number): string {
  const first = String(name || "mama").split(" ")[0];
  const appUrl = process.env.APP_URL || "";
  const cta = appUrl ? `${appUrl}/dashboard` : "";
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/></head>
<body style="margin:0;background:#fffaf6;font-family:'DM Sans',system-ui,Arial,sans-serif;color:#2d1b2e;line-height:1.7">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px">
    <div style="background:linear-gradient(135deg,#fef0f3,#f5f0ff);border:1px solid rgba(45,27,46,.08);border-radius:24px;padding:36px 28px;text-align:center">
      <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#e87b92;font-weight:700">Welcome to Bumply</div>
      <h1 style="font-family:Georgia,serif;font-weight:400;font-size:30px;margin:10px 0">Hello, ${first} 🌸</h1>
      <p style="margin:0 0 8px">You&apos;re in <strong>week ${week}</strong> — and from today, Bumply walks every week with you.</p>
      <p style="margin:0;color:#766275;font-size:14px">Each week you&apos;ll get your baby&apos;s real development, a 7-day meal plan, a note for your partner, and gentle support — right here and in your inbox.</p>
      ${cta ? `<a href="${cta}" style="display:inline-block;margin-top:22px;background:#e87b92;color:#fff;text-decoration:none;padding:13px 26px;border-radius:100px;font-weight:600">Open my dashboard →</a>` : ""}
    </div>
    <p style="text-align:center;color:#9a8a96;font-size:12px;margin-top:18px">With love, Bumply · The Brand NERVE</p>
  </div>
</body></html>`;
}

export async function sendWelcomeEmail(
  to: string,
  name: string,
  week: number
): Promise<{ sent: boolean; skipped?: boolean; error?: string }> {
  return sendEmail(to, `Welcome to Bumply, ${String(name || "mama").split(" ")[0]} 🌸`, buildWelcomeHtml(name, week));
}
