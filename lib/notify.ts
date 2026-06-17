import {
  listAllMothers,
  alreadyNotified,
  markNotified,
  type Mother,
} from "./queries";
import { currentWeekFrom } from "./babyData";
import { sendPushToMother } from "./push";
import { ancAtWeek } from "./anc";
import { milestoneAtWeek, type Milestone } from "./milestones";
import { dailyTipFor } from "./dailyTips";
import { sendEmail, emailConfigured } from "./email";

function firstName(m: Mother): string {
  return (m.full_name || "mama").split(" ")[0];
}

/** Push "your week N update is ready" once per (mother, week). */
export async function pushWeeklyReady(mother: Mother, week: number): Promise<boolean> {
  const ref = `week-${week}`;
  if (await alreadyNotified(mother.id, "weekly", ref)) return false;
  const n = await sendPushToMother(mother.id, {
    title: `Your week ${week} update is ready 🌸`,
    body: `${firstName(mother)}, tap to see how your baby is growing this week.`,
    url: "/dashboard",
    tag: "weekly",
  });
  await markNotified(mother.id, "weekly", ref);
  return n > 0;
}

function milestoneEmailHtml(mother: Mother, ms: Milestone): string {
  return `<!DOCTYPE html><html><body style="margin:0;background:#FBF7F1;font-family:'DM Sans',system-ui,Arial,sans-serif;color:#2E2620;line-height:1.7">
  <div style="max-width:520px;margin:0 auto;padding:32px 20px">
    <div style="background:linear-gradient(135deg,#F6E9E1,#EDF1E7);border-radius:24px;padding:36px 28px;text-align:center">
      <h1 style="font-family:Georgia,serif;font-weight:400;font-size:28px;margin:0 0 10px">${ms.title}</h1>
      <p style="margin:0;color:#5B4A3E">${firstName(mother)}, ${ms.body}</p>
    </div>
    <p style="text-align:center;color:#9A8576;font-size:12px;margin-top:18px">With love, Bumply 🌸</p>
  </div></body></html>`;
}

/** Days since epoch — used to rotate the daily tip deterministically per date. */
function daySeed(dateStr: string): number {
  const ms = Date.parse(dateStr + "T00:00:00Z");
  return Number.isNaN(ms) ? 0 : Math.floor(ms / 86400000);
}

export type DailyResult = { mothers: number; anc: number; milestone: number; daily: number };

/**
 * Daily engagement pass: ANC reminders + milestone celebrations + a daily tip,
 * each fired once via the notification_log de-dupe. `dateStr` = 'YYYY-MM-DD'.
 */
export async function runDailyEngagement(dateStr: string): Promise<DailyResult> {
  const mothers = await listAllMothers();
  let anc = 0,
    milestone = 0,
    daily = 0;

  for (const m of mothers) {
    const week = currentWeekFrom({ dueDate: m.due_date, enteredWeek: m.current_week, createdAt: m.created_at });

    // 1) ANC visit reminders for this week
    for (const item of ancAtWeek(week)) {
      const ref = `anc-${item.week}`;
      if (await alreadyNotified(m.id, "anc", ref)) continue;
      await sendPushToMother(m.id, { title: `🗓 ${item.title}`, body: item.detail, url: "/appointments", tag: ref });
      await markNotified(m.id, "anc", ref);
      anc++;
    }

    // 2) Milestone celebration (push + email)
    const ms = milestoneAtWeek(week);
    if (ms) {
      const ref = `milestone-${ms.week}`;
      if (!(await alreadyNotified(m.id, "milestone", ref))) {
        await sendPushToMother(m.id, { title: ms.title, body: ms.body, url: "/dashboard", tag: ref });
        if (emailConfigured()) {
          await sendEmail(m.email, ms.title, milestoneEmailHtml(m, ms)).catch(() => {});
        }
        await markNotified(m.id, "milestone", ref);
        milestone++;
      }
    }

    // 3) Daily tip / check-in nudge
    const dref = `daily-${dateStr}`;
    if (!(await alreadyNotified(m.id, "daily", dref))) {
      const tip = dailyTipFor(week, daySeed(dateStr));
      const n = await sendPushToMother(m.id, { title: "Bumply tip 🌿", body: tip, url: "/dashboard", tag: "daily" });
      await markNotified(m.id, "daily", dref);
      if (n > 0) daily++;
    }
  }

  return { mothers: mothers.length, anc, milestone, daily };
}
