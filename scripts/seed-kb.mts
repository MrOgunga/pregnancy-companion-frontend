// Seeds the RAG knowledge base with vetted, concise pregnancy guidance.
// Usage: npm run kb:seed   (re-runnable; clears + re-ingests)
import { readFileSync } from "node:fs";
// Load .env.local before importing app modules that read env at import time.
const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const { ensureKb, clearKb, ingest, kbCount } = await import("../lib/rag.ts");
const { meiliConfigured, meiliConfigure, meiliIndexDocs } = await import("../lib/meili.ts");

const KB: { title: string; source: string; content: string }[] = [
  { title: "Folic acid", source: "WHO", content: "Take folic acid (400–600 mcg) every day, ideally from before pregnancy through the first 12 weeks. It greatly lowers the risk of neural-tube defects like spina bifida in the baby's spine and brain." },
  { title: "Morning sickness", source: "general guidance", content: "Nausea and vomiting are common in the first trimester. Eat small frequent meals, nibble dry crackers before getting up, sip water or ginger, and avoid strong smells. See a provider if you cannot keep any fluids down, lose weight, or vomit blood." },
  { title: "Danger signs — seek care now", source: "WHO danger signs", content: "Go to a clinic or hospital urgently for: heavy vaginal bleeding, severe or constant tummy pain, severe headache with blurred vision, convulsions/fits, high fever, baby moving much less or not at all, or your waters breaking before 37 weeks." },
  { title: "Pre-eclampsia", source: "WHO", content: "High blood pressure (140/90 or more) with headache, blurred vision, upper-tummy pain or sudden swelling of face and hands can signal pre-eclampsia, which is dangerous. Have blood pressure and urine checked at every antenatal visit and report these symptoms the same day." },
  { title: "Antenatal visits (ANC)", source: "WHO 2016 ANC", content: "WHO recommends at least 8 antenatal contacts. Typical milestones: book before 12 weeks, dating scan ~12 weeks, detailed anomaly scan ~20 weeks, glucose check and Tdap around 28 weeks, growth and position checks in the third trimester, then more frequent checks near term." },
  { title: "Iron and anaemia", source: "WHO", content: "Anaemia is common in pregnancy. Eat iron-rich foods (beans, dark green vegetables, liver, red meat) with vitamin-C foods (oranges, peppers) to help absorption, and take any iron supplements your provider gives you. Tea/coffee with meals reduce iron absorption." },
  { title: "Nigerian pregnancy nutrition", source: "general guidance", content: "Build balanced plates from local foods: beans and moi-moi, jollof or ofada rice, eggs, fish and lean meat, ugu and other green vegetables, fruits like pawpaw, orange and banana, and pap/akamu. Wash fruits/vegetables well and cook meat, fish and eggs thoroughly." },
  { title: "Foods to limit or avoid", source: "general guidance", content: "Avoid raw or undercooked meat, fish and eggs, unpasteurised milk and soft cheeses, and limit caffeine to about one or two cups a day. Avoid alcohol completely. Wash produce and avoid leftover food left out too long." },
  { title: "Kick counting", source: "general guidance", content: "From around 28 weeks, get to know your baby's normal pattern of movements. Babies do not stop moving before birth. If movements clearly reduce or change, lie on your side and count; if you do not feel the usual movements, contact your clinic the same day — do not wait." },
  { title: "Signs of labour", source: "general guidance", content: "Labour may start with regular, strengthening contractions, a 'show' (mucus plug), or your waters breaking. A common guide is the 5-1-1 rule: contractions 5 minutes apart, lasting 1 minute, for 1 hour. Go in sooner if your waters break, you bleed, or you are less than 37 weeks." },
  { title: "Safe medicines", source: "general guidance", content: "Paracetamol is generally considered safe in pregnancy for pain or fever at the recommended dose. Avoid ibuprofen and other NSAIDs, especially in the third trimester, and always check any medicine, herb or traditional remedy with your provider or pharmacist first." },
  { title: "Exercise", source: "general guidance", content: "Gentle, regular activity like walking, swimming or prenatal yoga is good for most pregnancies. Aim for about 30 minutes most days, stay hydrated, avoid lying flat on your back for long in later pregnancy, and stop and seek advice if you have pain, bleeding or dizziness." },
  { title: "Sleep and comfort", source: "general guidance", content: "From the second trimester, sleep on your side (left side is often most comfortable and good for blood flow), use pillows between the knees and under the bump, and avoid lying flat on your back for long periods." },
  { title: "Heartburn", source: "general guidance", content: "Heartburn is common as the baby grows. Eat smaller meals, avoid spicy or fatty foods late at night, don't lie down right after eating, and prop your upper body up in bed. Ask your provider before using antacids." },
  { title: "Back pain", source: "general guidance", content: "Back pain is common as posture changes. Keep good posture, wear flat supportive shoes, lift with your knees, use a warm compress, and try gentle stretches or prenatal yoga. Tell your provider about severe pain or pain with fever or bleeding." },
  { title: "Swelling", source: "general guidance", content: "Mild swelling of feet and ankles is normal, especially later in the day. Rest with feet up, stay hydrated, and avoid standing for long. Sudden or severe swelling of the face and hands, with headache or vision changes, needs same-day medical review (possible pre-eclampsia)." },
  { title: "Gestational diabetes", source: "general guidance", content: "Some women develop high blood sugar in pregnancy (gestational diabetes), often screened around 24–28 weeks. It is usually managed with diet, activity and monitoring, sometimes medication, and helps protect both mum and baby. Follow your provider's testing advice." },
  { title: "Hydration", source: "general guidance", content: "Drink water steadily through the day (about 8 glasses). Good hydration helps with constipation, headaches, tiredness and reduces urine infections. Dark urine usually means you need more water." },
  { title: "Tetanus and vaccines", source: "WHO", content: "Tetanus-toxoid vaccination in pregnancy protects mother and newborn against tetanus. The Tdap (whooping cough) vaccine, often around 28 weeks, protects the baby in early life. Discuss recommended vaccines with your provider." },
  { title: "Hospital bag", source: "general guidance", content: "Pack your hospital bag by about 36 weeks: ANC/clinic card and ID, wrappers and nightwear, baby clothes, nappies and wipes, toiletries, pads, snacks and water, and any plans or medicines. Keep it where you can grab it quickly." },
  { title: "Mental health", source: "general guidance", content: "Mood changes are common, but persistent sadness, anxiety, or feeling unable to cope are not something to suffer alone. Talk to someone you trust and your provider; effective support and help are available, in pregnancy and after birth." },
  { title: "Bleeding in pregnancy", source: "general guidance", content: "Any vaginal bleeding in pregnancy should be reported to your provider. Light spotting can be harmless, but heavy bleeding, bleeding with pain or cramping, or bleeding in later pregnancy needs urgent medical review." },
  { title: "Fever in pregnancy", source: "general guidance", content: "A temperature of 38°C or higher should be checked, as infections like malaria and urinary infections are common and treatable but important in pregnancy. In malaria-endemic areas, use a treated bed net and seek prompt testing and treatment for fever." },
  { title: "Travel and seatbelts", source: "general guidance", content: "Wear your seatbelt with the lap strap under the bump across the hips and the shoulder strap between the breasts. On long trips, move and stretch regularly to reduce the risk of blood clots, and carry water and your clinic details." },
  { title: "Breastfeeding basics", source: "WHO", content: "WHO recommends starting breastfeeding within the first hour after birth and exclusive breastfeeding (only breast milk) for the first 6 months. Early skin-to-skin contact and frequent feeding help establish a good milk supply." },
];

await ensureKb();
await clearKb();
const n = await ingest(KB);
console.log(`✓ pgvector: ingested ${n} chunks. KB now has ${await kbCount()} rows.`);

if (meiliConfigured()) {
  await meiliConfigure();
  const docs = KB.map((k, i) => ({ id: `kb-${i}`, title: k.title, source: k.source, content: k.content }));
  const ok = await meiliIndexDocs(docs);
  console.log(ok ? `✓ Meilisearch: indexed ${docs.length} docs.` : "✗ Meilisearch indexing failed.");
} else {
  console.log("· Meilisearch not configured — skipped.");
}
process.exit(0);
