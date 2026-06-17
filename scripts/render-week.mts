// Renders a shareable square "Week N" recap video to public/share/week-N.mp4.
// Usage: npm run remotion:render -- <week> [name] [affirmation]
import path from "node:path";
import { mkdirSync } from "node:fs";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
import { getBabyData, babySizeText, trimesterFor } from "../lib/babyData.ts";
import { babyImageFor } from "../lib/babyImages.ts";

const week = Number(process.argv[2] || 8);
const name = process.argv[3] || "Amara";
const affirmation = process.argv[4] || "My body is wise, and my baby is growing exactly as they should.";

const baby = getBabyData(week);
const img = babyImageFor(week);
const inputProps = {
  week,
  name,
  babySize: baby ? babySizeText(week) : "growing beautifully 🌱",
  stage: img.stage,
  image: img.src.replace(/^\//, ""), // "baby/dev-06.jpg"
  affirmation,
  trimester: trimesterFor(week),
};

const root = path.resolve(".");
mkdirSync(path.join(root, "public", "share"), { recursive: true });

console.log("Bundling Remotion…");
const serveUrl = await bundle({
  entryPoint: path.join(root, "remotion", "index.ts"),
  publicDir: path.join(root, "public"),
});

const composition = await selectComposition({ serveUrl, id: "WeekRecap", inputProps });
const outputLocation = path.join(root, "public", "share", `week-${week}.mp4`);

console.log(`Rendering week ${week} for ${name}…`);
await renderMedia({ composition, serveUrl, codec: "h264", outputLocation, inputProps });
console.log("✓ Rendered:", `/share/week-${week}.mp4`);
