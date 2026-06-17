// Antenatal-care schedule (WHO / Nigeria-typical). Used for the /appointments page
// and to push a reminder when the mother reaches each visit week.
export type ANCItem = { week: number; title: string; detail: string };

export const ANC_SCHEDULE: ANCItem[] = [
  { week: 8, title: "Book your first antenatal visit", detail: "Register at your clinic or hospital. They'll confirm your due date and run baseline checks." },
  { week: 12, title: "Dating scan & booking bloods", detail: "An ultrasound to confirm dates, plus blood group, PCV, HIV, hepatitis and other booking tests." },
  { week: 16, title: "Antenatal check-up", detail: "Blood pressure, urine and baby's growth are checked. Bring any questions you've noted." },
  { week: 20, title: "Anomaly (detailed) scan", detail: "A detailed ultrasound checking baby's organs and growth. You may learn the sex if you wish." },
  { week: 24, title: "Antenatal check-up", detail: "BP, urine and fundal height. A good time to start counting baby's kicks daily." },
  { week: 28, title: "Glucose test, Tdap & check", detail: "Screening for gestational diabetes, the whooping-cough (Tdap) vaccine, and anti-D if you're Rh-negative." },
  { week: 32, title: "Growth check", detail: "BP, urine, growth and baby's position. A good time to discuss your birth preferences." },
  { week: 36, title: "Position check & birth plan", detail: "Baby's position is checked. Pack your hospital bag and finalise your birth plan." },
  { week: 38, title: "Antenatal check-up", detail: "Weekly checks begin now. Watch for the early signs of labour." },
  { week: 40, title: "Due-date check", detail: "Final checks. Your team will discuss next steps if baby is taking their time." },
];

export function ancAtWeek(week: number): ANCItem[] {
  return ANC_SCHEDULE.filter((i) => i.week === week);
}
export function upcomingANC(week: number, count = 4): ANCItem[] {
  return ANC_SCHEDULE.filter((i) => i.week >= week).slice(0, count);
}
export function pastANC(week: number): ANCItem[] {
  return ANC_SCHEDULE.filter((i) => i.week < week);
}
