// Sends the REAL Bumply welcome + weekly emails (using the app's own builders) to one address.
// Usage: npx tsx scripts/send-demo-emails.mts you@example.com [week]
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Load .env.local BEFORE importing app modules (some read env at import time).
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
try {
  const env = readFileSync(join(root, ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

const to = process.argv[2];
const week = Number(process.argv[3] || 8);
if (!to) { console.error("Usage: npx tsx scripts/send-demo-emails.mts you@example.com [week]"); process.exit(1); }

const { sendEmail, sendWelcomeEmail, readPublicImage } = await import("../lib/email.ts");
const { buildHtml } = await import("../lib/weekly.ts");
const { babyImageFor } = await import("../lib/babyImages.ts");

// A realistic sample mother + weekly content (no DB / no AI — just to show the design).
const mother: any = {
  id: "demo", email: to, full_name: "Amara Okafor", partner_name: "Chidi",
  due_date: null, first_pregnancy: true, dietary_restrictions: "no pork",
};
const content: any = {
  subject: "Amara, your little one is the size of a raspberry 🍓",
  babySize: "about 1.6 cm — the size of a raspberry",
  babyDevelopment:
    "This week your baby's tiny fingers and toes are beginning to form, and the heart is now beating around 150 times a minute. Though still the size of a raspberry, every day brings remarkable new detail.",
  momSymptoms: [
    { symptom: "Morning sickness", tip: "Nibble dry crackers or ginger before you even get out of bed." },
    { symptom: "Tender breasts", tip: "A soft, supportive bra (even at night) can make a real difference." },
    { symptom: "Fatigue", tip: "Your body is working hard — rest when you can, it's not laziness." },
  ],
  weeklyTip: "Keep taking your folic acid daily — it's quietly protecting your baby's developing spine right now.",
  partnerSection: [
    { title: "Take something off her plate", description: "Offer to handle dinner or the dishes this week — small acts mean everything." },
    { title: "Be her steady ground", description: "Hormones are surging. A calm hug beats any advice right now." },
    { title: "Come to the next scan", description: "Seeing the heartbeat together is a moment you'll both remember." },
  ],
  firstTimeMomTip:
    "Everything you're feeling — the excitement, the worry, the exhaustion — is completely normal. You're doing beautifully, Amara.",
  affirmation: "My body is wise, and my baby is growing exactly as they should.",
  mealPlan: {
    monday: { breakfast: "Akamu with moi moi", lunch: "Jollof rice & grilled chicken", dinner: "Vegetable soup with fufu", snack: "Sliced pawpaw" },
    tuesday: { breakfast: "Oats with banana", lunch: "Beans & plantain", dinner: "Grilled fish & yam", snack: "Greek yoghurt" },
    wednesday: { breakfast: "Bread & egg, fresh juice", lunch: "Ofada rice & sauce", dinner: "Pepper soup (chicken)", snack: "Groundnuts" },
    thursday: { breakfast: "Pap & akara", lunch: "Spaghetti & vegetables", dinner: "Efo riro with rice", snack: "Orange" },
    friday: { breakfast: "Smoothie & wheat toast", lunch: "Rice & beans, fish", dinner: "Yam porridge with ugu", snack: "Dates" },
    saturday: { breakfast: "Plantain & egg sauce", lunch: "Tuwo & miyan kuka", dinner: "Grilled chicken salad", snack: "Watermelon" },
    sunday: { breakfast: "Bean cake & pap", lunch: "Jollof & moi moi", dinner: "Vegetable rice & fish", snack: "Apple" },
    nutritionFocus: "Iron & folate-rich foods to support your baby's blood and spine.",
    foodsToAvoid: ["Unpasteurised milk", "Raw/undercooked eggs", "Excess caffeine"],
    hydrationTip: "Aim for 8 glasses of water — keep a bottle nearby and sip through the day.",
  },
};

// Authoritative size already baked into content.babySize.
const html = buildHtml(mother, week, content);
const img = babyImageFor(week);

// 1) Welcome email
const w = await sendWelcomeEmail(to, mother.full_name, week);
console.log("Welcome:", w);

// 2) Weekly email — embed the fetal image inline (cid) so it renders in Gmail.
let emailHtml = html;
let attachments: any[] | undefined;
try {
  const buf = await readPublicImage(img.file);
  emailHtml = html.replace(`src="${img.src}"`, `src="cid:babyhero"`);
  attachments = [{ filename: img.file, content: buf, contentId: "babyhero" }];
} catch (e) {
  console.warn("image embed skipped:", e);
}
const wk = await sendEmail(to, content.subject, emailHtml, attachments);
console.log("Weekly:", wk);
