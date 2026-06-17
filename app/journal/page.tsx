import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMotherById, listJournalEntries } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { normalizeLang } from "@/lib/languages";
import { t } from "@/lib/i18n";
import AppHeader from "../_components/AppHeader";
import JournalForm from "../_components/JournalForm";

export const dynamic = "force-dynamic";

const MOOD_EMOJI: Record<string, string> = { great: "😄", good: "🙂", okay: "😐", low: "😔", rough: "😣" };

export default async function JournalPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const mother = await getMotherById(session.sub);
  if (!mother) redirect("/login");

  const settings = await getSettings();
  if (!settings.journal_enabled) redirect("/dashboard");

  const entries = await listJournalEntries(mother.id);
  const L = normalizeLang(mother.language);

  // Consecutive-day journaling streak (counts from the latest entry if it's today/yesterday).
  const days = [...new Set(entries.map((e) => new Date(e.entry_date).toISOString().slice(0, 10)))].sort().reverse();
  let streak = 0;
  if (days.length) {
    const todayKey = new Date().toISOString().slice(0, 10);
    const yKey = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (days[0] === todayKey || days[0] === yKey) {
      let expect = new Date(days[0] + "T00:00:00Z");
      for (const d of days) {
        if (d === expect.toISOString().slice(0, 10)) { streak++; expect = new Date(expect.getTime() - 86400000); }
        else break;
      }
    }
  }

  return (
    <>
      <AppHeader plan={mother.plan} lang={mother.language} active="journal" features={{ journal: settings.journal_enabled, tools: settings.tools_enabled, chat: settings.chat_enabled }} />
      <div className="app-shell" style={{ maxWidth: 720 }}>
        <p className="s-label">{t("nav.journal", L)}</p>
        <h1 className="s-title" style={{ marginBottom: streak > 1 ? 8 : 20 }}>{t("journal.title", L)}</h1>
        {streak > 1 && (
          <p style={{ marginBottom: 20, fontFamily: "var(--serif)", fontSize: 18, color: "var(--pink)" }}>🔥 {streak}-day streak — keep it going!</p>
        )}

        <JournalForm lang={mother.language} />

        <p className="s-label">{t("journal.pastdays", L)}</p>
        <h3 className="feat-title" style={{ marginBottom: 16 }}>{t("journal.lookingback", L)}</h3>
        {entries.length === 0 ? (
          <p className="muted">{t("journal.noentries", L)}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {entries.map((e) => (
              <div key={e.id} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 22 }}>
                    {e.mood ? MOOD_EMOJI[e.mood] || "🌸" : "🌸"}{" "}
                    <span className="muted" style={{ fontSize: 13 }}>{new Date(e.entry_date).toISOString().slice(0, 10)}{e.week_number ? ` · ${t("dash.week", L)} ${e.week_number}` : ""}</span>
                  </span>
                </div>
                {e.symptoms && e.symptoms.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                    {e.symptoms.map((s) => (
                      <span key={s} className="chip" style={{ fontSize: 11 }}>{s}</span>
                    ))}
                  </div>
                )}
                {e.note && <p style={{ marginTop: 10 }}>{e.note}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
