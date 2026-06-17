import { ai, AI_MODEL } from "./ai";
import { resolveModel } from "./settings";
import { sql } from "./db";
import type { Mother, WeeklyUpdate } from "./queries";
import { getWeeklyUpdateByWeek } from "./queries";
import { randomBytes } from "node:crypto";
import { trimesterFor, getBabyData, babySizeText } from "./babyData";
import { babyImageFor } from "./babyImages";
import { languageInstruction } from "./languages";
import { preferencesBlock } from "./personalize";

export { trimesterFor };

export type WeeklyContent = {
  subject: string;
  babySize: string;
  babyDevelopment: string;
  momSymptoms: { symptom: string; tip: string }[];
  weeklyTip: string;
  partnerSection: { title: string; description: string }[];
  firstTimeMomTip: string;
  affirmation: string;
  mealPlan: {
    monday: Meal; tuesday: Meal; wednesday: Meal; thursday: Meal;
    friday: Meal; saturday: Meal; sunday: Meal;
    nutritionFocus: string; foodsToAvoid: string[]; hydrationTip: string;
  };
};
type Meal = { breakfast: string; lunch: string; dinner: string; snack: string };

function buildPrompt(mother: Mother, week: number): string {
  const remaining = Math.max(0, 40 - week);
  const baby = getBabyData(week);
  const facts = baby
    ? `VERIFIED FACTS for week ${week} (use these exactly — do NOT invent different numbers):
- Baby size: ${babySizeText(week)}
- Key development this week: ${baby.development}`
    : `This is very early — there is not yet a measurable baby size. Keep it gentle and hopeful.`;

  return `You are Bumply, a warm, careful pregnancy companion assistant.

Mother profile:
- Name: ${mother.full_name}
- Partner name: ${mother.partner_name || "(not provided)"}
- Current pregnancy week: ${week}
- Weeks remaining: ${remaining}
- Due date: ${mother.due_date || "(not provided)"}
- Trimester: ${trimesterFor(week)}
- First pregnancy: ${mother.first_pregnancy ? "yes" : "no"}
- Dietary restrictions: ${mother.dietary_restrictions || "none"}
- Ethnicity / cuisine: ${mother.ethnicity || "Nigerian (general)"}
${preferencesBlock(mother)}

${facts}

Return ONLY valid JSON with exactly this structure:
{
  "subject": "",
  "babySize": "",
  "babyDevelopment": "",
  "momSymptoms": [ { "symptom": "", "tip": "" }, { "symptom": "", "tip": "" }, { "symptom": "", "tip": "" } ],
  "weeklyTip": "",
  "partnerSection": [ { "title": "", "description": "" }, { "title": "", "description": "" }, { "title": "", "description": "" } ],
  "firstTimeMomTip": "",
  "affirmation": "",
  "mealPlan": {
    "monday": { "breakfast": "", "lunch": "", "dinner": "", "snack": "" },
    "tuesday": { "breakfast": "", "lunch": "", "dinner": "", "snack": "" },
    "wednesday": { "breakfast": "", "lunch": "", "dinner": "", "snack": "" },
    "thursday": { "breakfast": "", "lunch": "", "dinner": "", "snack": "" },
    "friday": { "breakfast": "", "lunch": "", "dinner": "", "snack": "" },
    "saturday": { "breakfast": "", "lunch": "", "dinner": "", "snack": "" },
    "sunday": { "breakfast": "", "lunch": "", "dinner": "", "snack": "" },
    "nutritionFocus": "",
    "foodsToAvoid": ["", "", ""],
    "hydrationTip": ""
  }
}

Rules:
- Use the real values above, not placeholders.
- For "babySize" use the verified size text exactly. For "babyDevelopment", write 2–3 warm sentences expanding on the verified key development — do not contradict it.
- Keep tone warm, reassuring, and personal. Address her by name.
- If first pregnancy is "yes", make firstTimeMomTip useful. If not, return an empty string.
- Respect the dietary restrictions in every meal.
- Keep all JSON keys exactly as shown in English, but write every VALUE (text the mother reads) in her language. ${languageInstruction(mother.language || "en")}
- CURATE THE 7-DAY MEAL PLAN around her ethnicity/cuisine (${mother.ethnicity || "Nigerian"}): use authentic, familiar, locally-available dishes from that culture (e.g. for Yoruba: amala & ewedu, ekuru; Igbo: ofe onugbu, abacha; Hausa: tuwo & miyan kuka, dambu; etc.), while keeping it nutritious for pregnancy and respecting her dietary restrictions.
- Do not output markdown. Do not wrap JSON in backticks.`;
}

function extractJson(raw: string): WeeklyContent {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON in model output");
  return JSON.parse(raw.slice(start, end + 1)) as WeeklyContent;
}

export async function generateWeeklyContent(mother: Mother, week: number): Promise<WeeklyContent> {
  const model = await resolveModel(AI_MODEL);
  const completion = await ai.chat.completions.create({
    model,
    temperature: 0.6,
    max_tokens: 2200,
    messages: [
      { role: "system", content: "You are Bumply, a warm pregnancy companion. You only ever reply with valid JSON." },
      { role: "user", content: buildPrompt(mother, week) },
    ],
  });
  return extractJson(completion.choices[0]?.message?.content || "");
}

function esc(s: string): string {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
}

export function buildHtml(mother: Mother, week: number, c: WeeklyContent): string {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
  const mealRows = days
    .map((d) => {
      const m = c.mealPlan?.[d] as Meal | undefined;
      if (!m) return "";
      return `<tr><td class="day">${d[0].toUpperCase() + d.slice(1)}</td>
        <td>${esc(m.breakfast)}</td><td>${esc(m.lunch)}</td><td>${esc(m.dinner)}</td><td>${esc(m.snack)}</td></tr>`;
    })
    .join("");
  const symptoms = (c.momSymptoms || [])
    .map((s) => `<li><strong>${esc(s.symptom)}</strong> — ${esc(s.tip)}</li>`)
    .join("");
  const partner = (c.partnerSection || [])
    .map((p) => `<div class="pcard"><h4>${esc(p.title)}</h4><p>${esc(p.description)}</p></div>`)
    .join("");
  const avoid = (c.mealPlan?.foodsToAvoid || []).map((f) => `<span class="chip">${esc(f)}</span>`).join("");
  const firstTime = c.firstTimeMomTip
    ? `<div class="block ft"><h3>💛 For a first-time mama</h3><p>${esc(c.firstTimeMomTip)}</p></div>`
    : "";

  const img = babyImageFor(week);

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Week ${week} · ${esc(mother.full_name)}'s Pregnancy Journey</title>
<style>
  :root{--pink:#C97B5A;--ink:#2E2620;--muted:#6b5a4d;--cream:#FBF7F1;--line:rgba(46,38,32,.12)}
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',system-ui,sans-serif;background:var(--cream);color:var(--ink);line-height:1.7;padding:28px 16px}
  .page{max-width:760px;margin:0 auto}
  .hero{background:linear-gradient(135deg,#F6E9E1,#EDF1E7);border:1px solid var(--line);border-radius:24px;padding:36px;text-align:center;margin-bottom:24px}
  .eyebrow{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--pink);font-weight:600}
  .babyimg{width:200px;height:200px;object-fit:cover;border-radius:50%;display:block;margin:18px auto 8px;border:5px solid #fff;box-shadow:0 8px 28px rgba(201,123,90,.28)}
  .babystage{font-size:12px;color:var(--muted);letter-spacing:.04em}
  h1{font-family:'Cormorant Garamond',Georgia,serif;font-weight:400;font-size:38px;margin:8px 0}
  .block{background:#fff;border:1px solid var(--line);border-radius:18px;padding:24px;margin-bottom:18px}
  .block h3{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:24px;margin-bottom:10px}
  .size{font-size:18px}.size b{color:var(--pink)}
  ul{list-style:none;display:flex;flex-direction:column;gap:8px}ul li{font-size:14px}
  table{width:100%;border-collapse:collapse;font-size:12px}
  th,td{border:1px solid var(--line);padding:8px;text-align:left;vertical-align:top}
  th{background:#F6E9E1;color:var(--ink)}.day{font-weight:600;background:#F3EDE4;white-space:nowrap}
  .pgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .pcard{background:#EBF2EE;border-radius:12px;padding:14px}.pcard h4{font-size:13px;margin-bottom:4px}.pcard p{font-size:12px;color:var(--muted)}
  .chip{display:inline-block;background:#fff;border:1px solid var(--line);border-radius:100px;padding:4px 12px;font-size:12px;margin:3px}
  .affirm{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:22px;text-align:center;color:var(--ink)}
  .ft{background:#FBF1DC;border-color:#E8B96F}
  .muted{color:var(--muted);font-size:13px}
  @media(max-width:560px){.pgrid{grid-template-columns:1fr}h1{font-size:30px}}
</style></head><body><div class="page">
  <div class="hero">
    <div class="eyebrow">Week ${week} · ${esc(trimesterFor(week))} trimester</div>
    <h1>${esc(c.subject || `Hello, ${mother.full_name}`)}</h1>
    <img class="babyimg" src="${img.src}" alt="Your baby's development around week ${week}" width="200" height="200"/>
    <p class="babystage">${esc(img.stage)}</p>
    <p class="size">Your baby is about <b>${esc(c.babySize)}</b> this week 🌱</p>
  </div>
  <div class="block"><h3>👶 Your baby this week</h3><p>${esc(c.babyDevelopment)}</p></div>
  <div class="block"><h3>🤰 How you may feel</h3><ul>${symptoms}</ul></div>
  <div class="block"><h3>🌿 This week's tip</h3><p>${esc(c.weeklyTip)}</p></div>
  ${firstTime}
  <div class="block"><h3>🥗 Your 7-day meal plan</h3>
    <p class="muted" style="margin-bottom:10px">Focus: ${esc(c.mealPlan?.nutritionFocus || "")}</p>
    <table><thead><tr><th>Day</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th><th>Snack</th></tr></thead>
    <tbody>${mealRows}</tbody></table>
    <p style="margin-top:12px">${avoid ? `<strong>Foods to avoid:</strong><br/>${avoid}` : ""}</p>
    <p class="muted" style="margin-top:10px">💧 ${esc(c.mealPlan?.hydrationTip || "")}</p>
  </div>
  <div class="block"><h3>💌 For ${esc(mother.partner_name || "your partner")}</h3><div class="pgrid">${partner}</div></div>
  <div class="block"><p class="affirm">"${esc(c.affirmation)}"</p></div>
  <p class="muted" style="text-align:center">With love, Bumply 🌸</p>
</div></body></html>`;
}

function makeSlug(): string {
  return randomBytes(9).toString("base64url");
}

/** Generate (if missing) and persist the weekly update for a given week. Idempotent per (mother, week). */
export async function ensureWeeklyUpdate(mother: Mother, week: number): Promise<WeeklyUpdate> {
  const existing = await getWeeklyUpdateByWeek(mother.id, week);
  if (existing) return existing;

  const content = await generateWeeklyContent(mother, week);
  // Authoritative facts win over anything the model wrote.
  content.babySize = babySizeText(week);
  const html = buildHtml(mother, week, content);
  const slug = makeSlug();

  const rows = await sql<WeeklyUpdate[]>`
    insert into weekly_updates
      (mother_id, week_number, subject, baby_size, baby_development, symptoms, weekly_tip,
       partner_section, first_time_mom_tip, affirmation, meal_plan, html_content, slug)
    values
      (${mother.id}, ${week}, ${content.subject}, ${content.babySize}, ${content.babyDevelopment},
       ${sql.json(content.momSymptoms)}, ${content.weeklyTip}, ${sql.json(content.partnerSection)},
       ${content.firstTimeMomTip}, ${content.affirmation}, ${sql.json(content.mealPlan)}, ${html}, ${slug})
    on conflict (mother_id, week_number) do nothing
    returning *`;

  if (rows[0]) return rows[0];
  // Lost a race — return the row the other writer created.
  return (await getWeeklyUpdateByWeek(mother.id, week))!;
}
