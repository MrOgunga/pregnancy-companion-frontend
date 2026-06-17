import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMotherById } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import AppHeader from "../_components/AppHeader";
import SubscribeButton from "../_components/SubscribeButton";

export const dynamic = "force-dynamic";

export default async function Account() {
  const session = await getSession();
  if (!session) redirect("/login");
  const mother = await getMotherById(session.sub);
  if (!mother) redirect("/login");

  const settings = await getSettings();
  const features = { journal: settings.journal_enabled, tools: settings.tools_enabled, chat: settings.chat_enabled };

  const row = (k: string, v: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
      <span className="muted">{k}</span>
      <span style={{ fontSize: 14 }}>{v || "—"}</span>
    </div>
  );

  return (
    <>
      <AppHeader plan={mother.plan} lang={mother.language} active="account" features={features} />
      <div className="app-shell" style={{ maxWidth: 640 }}>
        <p className="s-label">Account</p>
        <h1 className="s-title" style={{ marginBottom: 20 }}>Your <em>details</em></h1>

        <div className="card" style={{ marginBottom: 20 }}>
          {row("Name", mother.full_name)}
          {row("Email", mother.email)}
          {row("Partner", mother.partner_name || "")}
          {row("Phone / WhatsApp", mother.whatsapp_number || mother.phone || "")}
          {row("Current week", `Week ${mother.current_week} · ${mother.trimester} trimester`)}
          {row("Due date", mother.due_date || "")}
          {row("First pregnancy", mother.first_pregnancy ? "Yes" : "No")}
          {row("Dietary restrictions", mother.dietary_restrictions || "None")}
        </div>

        <div className="card">
          <p className="s-label">Plan</p>
          <h3 className="feat-title" style={{ marginBottom: 4 }}>
            You&apos;re on{" "}
            <span className={"badge " + (mother.plan === "premium" ? "badge-premium" : "badge-free")}>{mother.plan}</span>
          </h3>
          <p className="muted" style={{ marginBottom: 16 }}>
            {mother.plan === "premium"
              ? "Meal plans, partner notes and unlimited chat are unlocked."
              : "Upgrade to unlock meal plans, partner notes and chat with Bumply."}
          </p>
          {mother.plan === "premium" ? (
            <SubscribeButton plan="free" label="Cancel (back to Free)" href="/account" className="btn-ghost" />
          ) : (
            <SubscribeButton plan="premium" label="Upgrade to Premium (demo) ✨" href="/account" />
          )}
        </div>
      </div>
    </>
  );
}
