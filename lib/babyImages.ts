// Maps a gestational week to the closest real fetal-development image we have.
// The source pictures are a fertilisation → fetus series (8 stages). The files in
// /public/baby are named dev-01..dev-08 in order of ACTUAL development — the
// original filenames (week1.jpg etc.) did NOT track gestational weeks, so we never
// rely on them. This is pure (no fs) and safe to import from client or server.

export type BabyImage = {
  src: string; // root-relative path — works on the web and inside srcdoc iframes
  file: string; // filename under public/baby (used for inline email attachment)
  stage: string; // short, honest label for this developmental stage
};

const STAGES: { maxWeek: number; file: string; stage: string }[] = [
  { maxWeek: 3, file: "dev-01.jpg", stage: "Fertilisation" },
  { maxWeek: 4, file: "dev-02.jpg", stage: "A tiny ball of cells" },
  { maxWeek: 5, file: "dev-03.jpg", stage: "Settling in" },
  { maxWeek: 6, file: "dev-04.jpg", stage: "The embryo forms" },
  { maxWeek: 7, file: "dev-05.jpg", stage: "Limb buds appear" },
  { maxWeek: 8, file: "dev-06.jpg", stage: "Curled and growing" },
  { maxWeek: 12, file: "dev-07.jpg", stage: "Little features take shape" },
  { maxWeek: 99, file: "dev-08.jpg", stage: "Fully formed, growing strong" },
];

export function babyImageFor(week: number): BabyImage {
  const s = STAGES.find((x) => week <= x.maxWeek) ?? STAGES[STAGES.length - 1];
  return { src: `/baby/${s.file}`, file: s.file, stage: s.stage };
}

// For the landing-page "watch your baby grow" gallery.
export const DEV_STAGES: { file: string; label: string; caption: string }[] = [
  { file: "dev-01.jpg", label: "Weeks 1–3", caption: "Fertilisation" },
  { file: "dev-02.jpg", label: "Week 4", caption: "A tiny ball of cells" },
  { file: "dev-03.jpg", label: "Week 5", caption: "Settling in" },
  { file: "dev-04.jpg", label: "Week 6", caption: "The embryo forms" },
  { file: "dev-05.jpg", label: "Week 7", caption: "Limb buds appear" },
  { file: "dev-06.jpg", label: "Week 8", caption: "Curled and growing" },
  { file: "dev-07.jpg", label: "Weeks 9–12", caption: "Features take shape" },
  { file: "dev-08.jpg", label: "Week 13+", caption: "Fully formed" },
];
