import nodemailer from "nodemailer";
import type { EmailAttachment } from "./email";

// Gmail SMTP sender. Requires a Google App Password (16 chars) — NOT the normal
// account password — which needs 2-Step Verification enabled on the account.
export function gmailConfigured(): boolean {
  return !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

let transporter: nodemailer.Transporter | null = null;
function getTransport() {
  if (!gmailConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, ""), // app passwords often shown with spaces
      },
    });
  }
  return transporter;
}

export async function sendViaGmail(
  to: string,
  subject: string,
  html: string,
  attachments?: EmailAttachment[]
): Promise<{ sent: boolean; skipped?: boolean; error?: string; id?: string }> {
  const t = getTransport();
  if (!t) return { sent: false, skipped: true };
  try {
    const from = process.env.EMAIL_FROM || `Bumply <${process.env.GMAIL_USER}>`;
    const info = await t.sendMail({
      from,
      to,
      subject,
      html,
      attachments: attachments?.map((a) => ({ filename: a.filename, content: a.content, cid: a.contentId })),
    });
    return { sent: true, id: info.messageId };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : "gmail send failed" };
  }
}
