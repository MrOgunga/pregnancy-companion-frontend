import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMotherById, recentChat } from "@/lib/queries";
import { currentWeekFrom, trimesterFor } from "@/lib/babyData";
import { getSettings } from "@/lib/settings";
import AppHeader from "../_components/AppHeader";
import ChatPanel from "../_components/ChatPanel";

export const dynamic = "force-dynamic";

const SUGGESTIONS: Record<string, string[]> = {
  first: ["Is it normal to feel this tired?", "What can help with nausea?", "Which symptoms should worry me?"],
  second: ["What should I be eating now?", "When will I feel the baby kick?", "Is this back pain normal?"],
  third: ["How will I know labour is starting?", "What should be in my hospital bag?", "How can I sleep better now?"],
};

export default async function ChatPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const mother = await getMotherById(session.sub);
  if (!mother) redirect("/login");

  const settings = await getSettings();
  if (!settings.chat_enabled) redirect("/dashboard");
  const features = { journal: settings.journal_enabled, tools: settings.tools_enabled, chat: settings.chat_enabled };

  const week = currentWeekFrom({ dueDate: mother.due_date, enteredWeek: mother.current_week, createdAt: mother.created_at });
  const trimester = trimesterFor(week);

  return (
    <>
      <AppHeader plan={mother.plan} lang={mother.language} active="chat" features={features} />
      <div className="app-shell">
        <p className="s-label">Talk to Bumply</p>
        <h1 className="s-title" style={{ marginBottom: 16 }}>
          Your <em>companion</em>, any time
        </h1>

        {mother.plan === "premium" ? (
          <>
            <ChatPanel
              name={mother.full_name}
              suggestions={SUGGESTIONS[trimester]}
              initial={await loadInitial(mother.id, mother.full_name, week)}
            />
            <p className="muted" style={{ textAlign: "center", marginTop: 12, fontSize: 11 }}>
              Bumply offers warm, general guidance — not medical advice. For anything urgent, contact your healthcare provider.
            </p>
          </>
        ) : (
          <div className="pay-wall">
            <h3 className="feat-title">🔒 One-on-one chat is premium</h3>
            <p className="muted" style={{ marginBottom: 16 }}>
              Upgrade and chat with Bumply any time — answers grounded in exactly where you are in your journey.
            </p>
            <a className="btn-pink" href="/pricing">See plans</a>
          </div>
        )}
      </div>
    </>
  );
}

async function loadInitial(motherId: string, name: string, week: number) {
  const history = await recentChat(motherId, 30);
  if (history.length > 0) {
    return history.map((h) => ({ role: h.role as "user" | "assistant", content: h.content }));
  }
  return [
    {
      role: "assistant" as const,
      content: `Hello ${name} 🌸 You're in week ${week}. How are you feeling today? Ask me anything — symptoms, cravings, what's normal, or just how you're doing.`,
    },
  ];
}
