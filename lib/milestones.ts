// Celebratory milestones — pushed + emailed once when the mother reaches each week.
export type Milestone = { week: number; title: string; body: string };

export const MILESTONES: Milestone[] = [
  { week: 13, title: "Second trimester! 🎉", body: "You've reached the second trimester — often the most comfortable stretch of pregnancy. Well done, mama!" },
  { week: 24, title: "A big milestone 💛", body: "Your baby has reached an important point this week. Every day from here makes them stronger." },
  { week: 28, title: "Third trimester! 🌟", body: "The home stretch begins. A lovely time to think about your hospital bag and birth plan." },
  { week: 37, title: "Full term! 🤰", body: "Your baby is now considered full term and could arrive any time. You are so ready." },
  { week: 40, title: "Your due date is here! 🎀", body: "Week 40 — your big week. Sending you strength, mama. We can't wait to meet your little one." },
];

export function milestoneAtWeek(week: number): Milestone | undefined {
  return MILESTONES.find((m) => m.week === week);
}
