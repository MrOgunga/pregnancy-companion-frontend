import { sql } from "./db";

export type Mother = {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  partner_name: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  due_date: string | null;
  current_week: number;
  weeks_completed: number | null;
  trimester: string | null;
  first_pregnancy: boolean | null;
  dietary_restrictions: string | null;
  source: string | null;
  plan: "free" | "premium";
  language: string | null;
  last_sent_at: string | null;
  created_at: string;
};

export type WeeklyUpdate = {
  id: string;
  mother_id: string;
  week_number: number;
  subject: string | null;
  baby_size: string | null;
  baby_development: string | null;
  symptoms: { symptom: string; tip: string }[] | null;
  weekly_tip: string | null;
  partner_section: { title: string; description: string }[] | null;
  first_time_mom_tip: string | null;
  affirmation: string | null;
  meal_plan: Record<string, unknown> | null;
  html_content: string | null;
  slug: string | null;
  sent_email: boolean;
  sent_whatsapp: boolean;
  created_at: string;
};

export async function getMotherByEmail(email: string): Promise<Mother | null> {
  const rows = await sql<Mother[]>`select * from mothers where email = ${email.toLowerCase()} limit 1`;
  return rows[0] ?? null;
}

export async function getMotherById(id: string): Promise<Mother | null> {
  const rows = await sql<Mother[]>`select * from mothers where id = ${id} limit 1`;
  return rows[0] ?? null;
}

// Match an inbound WhatsApp sender (any format) to a mother by the last 10 digits,
// which sidesteps country-code / leading-zero differences (e.g. +234 vs 0).
export async function getMotherByPhone(phone: string): Promise<Mother | null> {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length < 7) return null;
  const last10 = digits.slice(-10);
  const rows = await sql<Mother[]>`
    select * from mothers
    where right(regexp_replace(coalesce(whatsapp_number, ''), '\D', '', 'g'), 10) = ${last10}
       or right(regexp_replace(coalesce(phone, ''), '\D', '', 'g'), 10) = ${last10}
    order by created_at desc
    limit 1`;
  return rows[0] ?? null;
}

export async function createMother(m: {
  email: string;
  password_hash: string;
  full_name: string;
  partner_name?: string;
  phone?: string;
  whatsapp_number?: string;
  due_date?: string;
  current_week: number;
  weeks_completed: number;
  trimester: string;
  first_pregnancy: boolean;
  dietary_restrictions?: string;
  source?: string;
  language?: string;
}): Promise<Mother> {
  const rows = await sql<Mother[]>`
    insert into mothers
      (email, password_hash, full_name, partner_name, phone, whatsapp_number, due_date,
       current_week, weeks_completed, trimester, first_pregnancy, dietary_restrictions, source, language)
    values
      (${m.email.toLowerCase()}, ${m.password_hash}, ${m.full_name}, ${m.partner_name ?? null},
       ${m.phone ?? null}, ${m.whatsapp_number ?? m.phone ?? null}, ${m.due_date ?? null},
       ${m.current_week}, ${m.weeks_completed}, ${m.trimester}, ${m.first_pregnancy},
       ${m.dietary_restrictions ?? null}, ${m.source ?? "website"}, ${m.language ?? "en"})
    returning *`;
  return rows[0];
}

export async function updateMotherLanguage(id: string, language: string) {
  await sql`update mothers set language = ${language} where id = ${id}`;
}

export async function setPlan(id: string, plan: "free" | "premium") {
  await sql`update mothers set plan = ${plan} where id = ${id}`;
}

export async function listAllMothers(): Promise<Mother[]> {
  return sql<Mother[]>`select * from mothers order by created_at desc`;
}

export type AdminStats = {
  users: number; premium: number; free: number; new_week: number;
  updates: number; chats: number; journal: number; kicks: number;
};

export async function adminStats(): Promise<AdminStats> {
  const rows = await sql<Record<string, string>[]>`
    select
      (select count(*) from mothers)                                          as users,
      (select count(*) from mothers where plan = 'premium')                   as premium,
      (select count(*) from mothers where plan = 'free')                      as free,
      (select count(*) from mothers where created_at > now() - interval '7 days') as new_week,
      (select count(*) from weekly_updates)                                   as updates,
      (select count(*) from chat_messages)                                    as chats,
      (select count(*) from journal_entries)                                  as journal,
      (select count(*) from kick_sessions)                                    as kicks`;
  const r = rows[0] || {};
  const n = (k: string) => Number(r[k] || 0);
  return {
    users: n("users"), premium: n("premium"), free: n("free"), new_week: n("new_week"),
    updates: n("updates"), chats: n("chats"), journal: n("journal"), kicks: n("kicks"),
  };
}

export async function deleteMother(id: string) {
  await sql`delete from mothers where id = ${id}`;
}

// --- Web-push subscriptions ---
export type PushSub = { id: string; mother_id: string; endpoint: string; p256dh: string; auth: string };

export async function savePushSubscription(motherId: string, s: { endpoint: string; p256dh: string; auth: string }) {
  await sql`
    insert into push_subscriptions (mother_id, endpoint, p256dh, auth)
    values (${motherId}, ${s.endpoint}, ${s.p256dh}, ${s.auth})
    on conflict (endpoint) do update
      set mother_id = excluded.mother_id, p256dh = excluded.p256dh, auth = excluded.auth`;
}

export async function deletePushSubscription(endpoint: string) {
  await sql`delete from push_subscriptions where endpoint = ${endpoint}`;
}

export async function listPushSubscriptions(motherId: string): Promise<PushSub[]> {
  return sql<PushSub[]>`select * from push_subscriptions where mother_id = ${motherId}`;
}

export async function listAllPushSubscriptions(): Promise<PushSub[]> {
  return sql<PushSub[]>`select * from push_subscriptions`;
}

// --- Notification de-dupe log (fire each reminder/milestone/etc. once) ---
export async function alreadyNotified(motherId: string, kind: string, ref: string): Promise<boolean> {
  const rows = await sql`select 1 from notification_log where mother_id = ${motherId} and kind = ${kind} and ref = ${ref} limit 1`;
  return rows.length > 0;
}

export async function markNotified(motherId: string, kind: string, ref: string) {
  await sql`insert into notification_log (mother_id, kind, ref) values (${motherId}, ${kind}, ${ref}) on conflict do nothing`;
}

export async function setUpdateSent(updateId: string, channel: "email" | "whatsapp") {
  if (channel === "email") await sql`update weekly_updates set sent_email = true where id = ${updateId}`;
  else await sql`update weekly_updates set sent_whatsapp = true where id = ${updateId}`;
}

export async function updateMotherWeek(id: string, week: number, trimester: string) {
  await sql`update mothers set current_week = ${week}, trimester = ${trimester} where id = ${id}`;
}

export async function listWeeklyUpdates(motherId: string): Promise<WeeklyUpdate[]> {
  return sql<WeeklyUpdate[]>`
    select * from weekly_updates where mother_id = ${motherId} order by week_number desc`;
}

export async function getWeeklyUpdateByWeek(motherId: string, week: number): Promise<WeeklyUpdate | null> {
  const rows = await sql<WeeklyUpdate[]>`
    select * from weekly_updates where mother_id = ${motherId} and week_number = ${week} limit 1`;
  return rows[0] ?? null;
}

export async function getWeeklyUpdateBySlug(slug: string): Promise<WeeklyUpdate | null> {
  const rows = await sql<WeeklyUpdate[]>`select * from weekly_updates where slug = ${slug} limit 1`;
  return rows[0] ?? null;
}

export async function recentChat(motherId: string, limit = 20) {
  const rows = await sql<{ role: string; content: string }[]>`
    select role, content from chat_messages
    where mother_id = ${motherId} order by created_at desc limit ${limit}`;
  return rows.reverse();
}

export async function saveChat(motherId: string, role: "user" | "assistant", content: string, week: number) {
  await sql`insert into chat_messages (mother_id, role, content, week_number)
            values (${motherId}, ${role}, ${content}, ${week})`;
}

// --- Journal ---
export type JournalEntry = {
  id: string;
  mother_id: string;
  entry_date: string;
  mood: string | null;
  symptoms: string[] | null;
  note: string | null;
  week_number: number | null;
  created_at: string;
};

export async function createJournalEntry(
  motherId: string,
  e: { mood?: string; symptoms?: string[]; note?: string; week?: number }
): Promise<JournalEntry> {
  const rows = await sql<JournalEntry[]>`
    insert into journal_entries (mother_id, mood, symptoms, note, week_number)
    values (${motherId}, ${e.mood ?? null}, ${sql.json(e.symptoms ?? [])}, ${e.note ?? null}, ${e.week ?? null})
    returning *`;
  return rows[0];
}

export async function listJournalEntries(motherId: string, limit = 60): Promise<JournalEntry[]> {
  return sql<JournalEntry[]>`
    select * from journal_entries where mother_id = ${motherId} order by created_at desc limit ${limit}`;
}

export async function recentJournalSummary(motherId: string, limit = 5): Promise<string> {
  const rows = await sql<JournalEntry[]>`
    select * from journal_entries where mother_id = ${motherId} order by created_at desc limit ${limit}`;
  if (rows.length === 0) return "";
  return rows
    .map((r) => {
      const s = (r.symptoms || []).join(", ");
      return `- ${r.entry_date}: mood ${r.mood || "n/a"}${s ? `, symptoms: ${s}` : ""}${r.note ? `, note: "${r.note}"` : ""}`;
    })
    .join("\n");
}

// --- Kick counter ---
export type KickSession = {
  id: string;
  mother_id: string;
  started_at: string;
  completed_at: string | null;
  kicks: number;
  week_number: number | null;
  created_at: string;
};

export async function saveKickSession(
  motherId: string,
  s: { started_at: string; completed_at?: string; kicks: number; week?: number }
): Promise<KickSession> {
  const rows = await sql<KickSession[]>`
    insert into kick_sessions (mother_id, started_at, completed_at, kicks, week_number)
    values (${motherId}, ${s.started_at}, ${s.completed_at ?? null}, ${s.kicks}, ${s.week ?? null})
    returning *`;
  return rows[0];
}

export async function listKickSessions(motherId: string, limit = 20): Promise<KickSession[]> {
  return sql<KickSession[]>`
    select * from kick_sessions where mother_id = ${motherId} order by created_at desc limit ${limit}`;
}
