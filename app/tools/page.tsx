import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMotherById, listKickSessions } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { currentWeekFrom } from "@/lib/babyData";
import AppHeader from "../_components/AppHeader";
import KickCounter from "../_components/KickCounter";
import ContractionTimer from "../_components/ContractionTimer";

export const dynamic = "force-dynamic";

export default async function ToolsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const mother = await getMotherById(session.sub);
  if (!mother) redirect("/login");

  const settings = await getSettings();
  if (!settings.tools_enabled) redirect("/dashboard");

  const week = currentWeekFrom({ dueDate: mother.due_date, enteredWeek: mother.current_week, createdAt: mother.created_at });
  const kicks = await listKickSessions(mother.id);

  return (
    <>
      <AppHeader plan={mother.plan} lang={mother.language} active="tools" features={{ journal: settings.journal_enabled, tools: settings.tools_enabled, chat: settings.chat_enabled }} />
      <div className="app-shell" style={{ maxWidth: 720 }}>
        <p className="s-label">Tools</p>
        <h1 className="s-title" style={{ marginBottom: 8 }}>Your <em>toolkit</em></h1>
        <p className="muted" style={{ marginBottom: 24 }}>
          You&apos;re in week {week}. {week < 28 ? "The kick counter becomes most useful from around week 28." : "Perfect time to keep an eye on baby's movements."}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <KickCounter />

          {kicks.length > 0 && (
            <div className="card">
              <p className="s-label">Recent kick sessions</p>
              <table style={{ width: "100%", marginTop: 10, fontSize: 13, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "var(--ink-muted)" }}>
                    <th style={{ padding: "6px 4px", fontWeight: 500 }}>When</th>
                    <th style={{ padding: "6px 4px", fontWeight: 500 }}>Kicks</th>
                    <th style={{ padding: "6px 4px", fontWeight: 500 }}>Took</th>
                  </tr>
                </thead>
                <tbody>
                  {kicks.map((k) => {
                    const took = k.completed_at ? Math.round((new Date(k.completed_at).getTime() - new Date(k.started_at).getTime()) / 60000) : null;
                    return (
                      <tr key={k.id} style={{ borderTop: "1px solid var(--border)" }}>
                        <td style={{ padding: "6px 4px" }}>{new Date(k.started_at).toLocaleDateString()} {new Date(k.started_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                        <td style={{ padding: "6px 4px" }}>{k.kicks}</td>
                        <td style={{ padding: "6px 4px" }}>{took != null ? `${took} min` : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <ContractionTimer />
        </div>
      </div>
    </>
  );
}
