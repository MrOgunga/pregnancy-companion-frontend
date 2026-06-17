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

  return (
    <>
      <AppHeader plan={mother.plan} lang={mother.language} active="journal" features={{ journal: settings.journal_enabled, tools: settings.tools_enabled, chat: settings.chat_enabled }} />
      <div className="app-shell" style={{ maxWidth: 720 }}>
        <p className="s-label">{t("nav.journal", L)}</p>
        <h1 className="s-title" style={{ marginBottom: 20 }}>{t("journal.title", L)}</h1>

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
                    <span className="muted" style={{ fontSize: 13 }}>{e.entry_date}{e.week_number ? ` · ${t("dash.week", L)} ${e.week_number}` : ""}</span>
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
