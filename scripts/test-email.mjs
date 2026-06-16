// Quick Resend sanity check. Usage: node scripts/test-email.mjs you@example.com
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Resend } from "resend";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
try {
  const env = readFileSync(join(root, ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

const key = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM || "Bumply <onboarding@resend.dev>";
const to = process.argv[2];
if (!key) { console.error("RESEND_API_KEY missing"); process.exit(1); }
if (!to) { console.error("Usage: node scripts/test-email.mjs you@example.com"); process.exit(1); }

const resend = new Resend(key);
const { data, error } = await resend.emails.send({
  from,
  to: [to],
  subject: "Bumply · Resend test 🌸",
  html: `<div style="font-family:system-ui;padding:24px"><h2 style="color:#e87b92">It works! 🌸</h2><p>Your Bumply email integration (Resend) is live.</p><p style="color:#888">from: ${from}</p></div>`,
});
if (error) { console.error("SEND FAILED:", error); process.exit(1); }
console.log("Sent OK. id:", data?.id, "→", to, "from", from);
