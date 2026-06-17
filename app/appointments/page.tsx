import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMotherById } from "@/lib/queries";
import { currentWeekFrom } from "@/lib/babyData";
import { ANC_SCHEDULE } from "@/lib/anc";
import { getSettings } from "@/lib/settings";
import AppHeader from "../_components/AppHeader";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const mother = await getMotherById(session.sub);
  if (!mother) redirect("/login");

  const week = currentWeekFrom({ dueDate: mother.due_date, enteredWeek: mother.current_week, createdAt: mother.created_at });
  const settings = await getSettings();
  const features = { journal: settings.journal_enabled, tools: settings.tools_enabled, chat: settings.chat_enabled };

  return (
    <>
      <AppHeader plan={mother.plan} lang={mother.language} active="appointments" features={features} />
      <div className="app-shell">
        <p className="s-label">Antenatal care</p>
        <h1 className="s-title" style={{ marginBottom: 6 }}>Your appointment schedule</h1>
        <p className="muted" style={{ marginBottom: 24 }}>
          A typical antenatal visit, scan &amp; test plan — Bumply reminds you as each one approaches. Always
          follow your own clinic&apos;s advice.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ANC_SCHEDULE.map((item) => {
            const status = week > item.week ? "done" : week === item.week ? "now" : "upcoming";
            const color = status === "done" ? "var(--sage)" : status === "now" ? "var(--pink)" : "var(--ink-muted)";
            const label = status === "done" ? "✓ Done" : status === "now" ? "This week" : `Week ${item.week}`;
            return (
              <div key={item.week} className="card" style={{ display: "flex", gap: 16, alignItems: "flex-start", opacity: status === "done" ? 0.65 : 1 }}>
                <div
                  style={{
                    flex: "0 0 auto", width: 56, height: 56, borderRadius: 14,
                    background: status === "now" ? "var(--pink-pale)" : "var(--lav-pale)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: 10, color: "var(--ink-muted)", textTransform: "uppercase" }}>Wk</span>
                  <span style={{ fontFamily: "var(--serif)", fontSize: 22, lineHeight: 1 }}>{item.week}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                    <p style={{ fontFamily: "var(--serif)", fontSize: 18 }}>{item.title}</p>
                    <span style={{ fontSize: 12, fontWeight: 600, color, whiteSpace: "nowrap" }}>{label}</span>
                  </div>
                  <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>{item.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
