// Vetted, week-by-week baby facts so size/length/weight/development are never AI-hallucinated.
// Values are widely-cited averages (crown–rump length through ~week 19, crown–heel from week 20)
// and are intentionally approximate — every mom and baby is different.

export type BabyWeek = {
  fruit: string;      // friendly size comparison
  lengthCm: number;   // approx length
  weightG: number;    // approx weight
  development: string; // one-line headline of what's happening
};

export const BABY_DATA: Record<number, BabyWeek> = {
  4: { fruit: "a poppy seed", lengthCm: 0.1, weightG: 0, development: "the neural tube — baby's brain and spine — is forming" },
  5: { fruit: "a sesame seed", lengthCm: 0.2, weightG: 0, development: "the tiny heart is beginning to beat" },
  6: { fruit: "a lentil", lengthCm: 0.4, weightG: 0, development: "little limb buds are appearing" },
  7: { fruit: "a blueberry", lengthCm: 1.0, weightG: 1, development: "hands and feet are starting to form" },
  8: { fruit: "a raspberry", lengthCm: 1.6, weightG: 1, development: "baby is starting to make tiny movements" },
  9: { fruit: "a cherry", lengthCm: 2.3, weightG: 2, development: "essential organs are taking shape" },
  10: { fruit: "a strawberry", lengthCm: 3.1, weightG: 4, development: "vital organs are beginning to work" },
  11: { fruit: "a lime", lengthCm: 4.1, weightG: 7, development: "tiny tooth buds are appearing" },
  12: { fruit: "a plum", lengthCm: 5.4, weightG: 14, development: "reflexes are developing — baby can curl fingers" },
  13: { fruit: "a pea pod", lengthCm: 7.4, weightG: 23, development: "unique fingerprints are forming" },
  14: { fruit: "a lemon", lengthCm: 8.7, weightG: 43, development: "baby can squint, frown and grimace" },
  15: { fruit: "an apple", lengthCm: 10.1, weightG: 70, development: "baby is sensing light, though eyes are still closed" },
  16: { fruit: "an avocado", lengthCm: 11.6, weightG: 100, development: "baby can make facial expressions" },
  17: { fruit: "a pear", lengthCm: 13.0, weightG: 140, development: "the skeleton is hardening from cartilage to bone" },
  18: { fruit: "a bell pepper", lengthCm: 14.2, weightG: 190, development: "ears are in position — baby may start to hear" },
  19: { fruit: "a mango", lengthCm: 15.3, weightG: 240, development: "a protective coating (vernix) covers baby's skin" },
  20: { fruit: "a banana", lengthCm: 25.6, weightG: 300, development: "you're halfway! baby can swallow and is more active" },
  21: { fruit: "a carrot", lengthCm: 26.7, weightG: 360, development: "eyebrows and eyelids are fully formed" },
  22: { fruit: "a spaghetti squash", lengthCm: 27.8, weightG: 430, development: "baby's sense of touch is developing" },
  23: { fruit: "a large mango", lengthCm: 28.9, weightG: 501, development: "baby can hear sounds from outside" },
  24: { fruit: "an ear of corn", lengthCm: 30.0, weightG: 600, development: "the lungs are developing branches and cells" },
  25: { fruit: "a rutabaga", lengthCm: 34.6, weightG: 660, development: "baby is responding to your voice and touch" },
  26: { fruit: "a head of lettuce", lengthCm: 35.6, weightG: 760, development: "eyes are beginning to open" },
  27: { fruit: "a cauliflower", lengthCm: 36.6, weightG: 875, development: "baby is settling into sleep and wake cycles" },
  28: { fruit: "an eggplant", lengthCm: 37.6, weightG: 1005, development: "baby can dream (REM sleep) now" },
  29: { fruit: "a butternut squash", lengthCm: 38.6, weightG: 1153, development: "muscles and lungs are maturing" },
  30: { fruit: "a cabbage", lengthCm: 39.9, weightG: 1319, development: "eyesight is developing, though still blurry" },
  31: { fruit: "a coconut", lengthCm: 41.1, weightG: 1502, development: "baby's brain is growing rapidly" },
  32: { fruit: "a squash", lengthCm: 42.4, weightG: 1702, development: "baby is practising breathing movements" },
  33: { fruit: "a pineapple", lengthCm: 43.7, weightG: 1918, development: "bones are hardening, though the skull stays soft" },
  34: { fruit: "a cantaloupe", lengthCm: 45.0, weightG: 2146, development: "the lungs are nearly ready for the outside world" },
  35: { fruit: "a honeydew melon", lengthCm: 46.2, weightG: 2383, development: "kidneys are fully developed" },
  36: { fruit: "a head of romaine lettuce", lengthCm: 47.4, weightG: 2622, development: "baby is gaining weight quickly and getting plump" },
  37: { fruit: "a bunch of swiss chard", lengthCm: 48.6, weightG: 2859, development: "baby is practising for life outside — grasping, breathing" },
  38: { fruit: "a leek", lengthCm: 49.8, weightG: 3083, development: "baby's grip is firming up" },
  39: { fruit: "a small watermelon", lengthCm: 50.7, weightG: 3288, development: "baby is ready to meet you very soon" },
  40: { fruit: "a small pumpkin", lengthCm: 51.2, weightG: 3462, development: "baby is fully developed — any day now!" },
};

export function getBabyData(week: number): BabyWeek | null {
  if (week < 4) return null; // too early for a meaningful size
  if (week > 40) return BABY_DATA[40];
  return BABY_DATA[week] ?? null;
}

export function babySizeText(week: number): string {
  const d = getBabyData(week);
  if (!d) return "just beginning their incredible journey";
  const weight = d.weightG >= 1000 ? `${(d.weightG / 1000).toFixed(2)} kg` : d.weightG > 0 ? `${d.weightG} g` : "a few milligrams";
  return `the size of ${d.fruit} — about ${d.lengthCm} cm and ${weight}`;
}

export function trimesterFor(week: number): "first" | "second" | "third" {
  if (week <= 13) return "first";
  if (week <= 26) return "second";
  return "third";
}

const DAY = 24 * 60 * 60 * 1000;

/**
 * Current gestational week, computed live.
 * Prefers the due date (40 weeks = 280 days of gestation); otherwise advances the
 * week the mom entered at signup by the time elapsed since she registered.
 */
export function currentWeekFrom(opts: {
  dueDate?: string | null;
  enteredWeek?: number | null;
  createdAt?: string | null;
  now?: Date;
}): number {
  const now = opts.now ?? new Date();
  if (opts.dueDate) {
    const due = new Date(opts.dueDate + "T00:00:00");
    if (!isNaN(due.getTime())) {
      const daysUntilDue = Math.round((due.getTime() - now.getTime()) / DAY);
      const week = Math.round((280 - daysUntilDue) / 7);
      return clamp(week, 1, 42);
    }
  }
  if (opts.enteredWeek && opts.createdAt) {
    const created = new Date(opts.createdAt);
    const weeksElapsed = Math.floor((now.getTime() - created.getTime()) / (7 * DAY));
    return clamp(opts.enteredWeek + weeksElapsed, 1, 42);
  }
  return clamp(opts.enteredWeek ?? 1, 1, 42);
}

/** Weeks 1–40 → 0–100% of the journey. */
export function progressPct(week: number): number {
  return clamp(Math.round((Math.min(week, 40) / 40) * 100), 0, 100);
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
