import { trimesterFor } from "./babyData";

// A small rotating library of daily tips, picked by trimester + a day seed so each
// day shows a different one. (AI-personalised daily tips can replace this later.)
const TIPS: Record<string, string[]> = {
  first: [
    "Sip water through the day — even mild dehydration can worsen nausea and fatigue. 💧",
    "Keep taking your folic acid daily; it's quietly protecting baby's developing spine. 🌱",
    "Nibble dry crackers before getting out of bed to ease morning sickness. 🍪",
    "Tired? That's your body building a placenta — rest when you can, it's not laziness. 😴",
    "Small, frequent meals are kinder to a queasy tummy than three big ones. 🍽️",
    "Ginger or lemon can take the edge off nausea — keep some handy. 🍋",
  ],
  second: [
    "Feeling more energy? A gentle daily walk is great for you and baby. 🚶🏾‍♀️",
    "Start sleeping on your side — it's the comfiest and best for blood flow. 🛏️",
    "Iron-rich foods (beans, greens, liver) help build baby's blood supply. 🥬",
    "Moisturise your bump to keep skin comfortable as it grows. 🤰",
    "Around now you may feel first kicks — note when baby is most active. 👣",
    "Stay on top of your antenatal visits; ask your midwife anything on your mind. 🩺",
  ],
  third: [
    "Count baby's kicks daily — you should feel a regular pattern. Tell your provider if it changes. 👣",
    "Pack your hospital bag early so you're ready whenever baby decides. 🎒",
    "Practice slow, deep breathing — it'll serve you well in labour. 🌬️",
    "Swollen feet? Put them up when you can, and mention sudden swelling to your provider. 🦶",
    "Rest often — short naps help you store energy for the big day. 😴",
    "Know the signs of labour (regular contractions, waters breaking) and your clinic's number. 📞",
  ],
};

export function dailyTipFor(week: number, daySeed: number): string {
  const list = TIPS[trimesterFor(week)] || TIPS.first;
  return list[Math.abs(daySeed) % list.length];
}
