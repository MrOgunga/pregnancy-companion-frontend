import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/adminSession";
import { adminStats } from "@/lib/queries";
import { emailConfigured } from "@/lib/email";
import { whatsappConfigured } from "@/lib/whatsapp";
import AdminNav from "../_components/AdminNav";
import RunWeeklyButton from "../_components/RunWeeklyButton";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!(await isAdmin())) redirect("/admin/login");
  const s = await adminStats();

  const stat = (label: string, value: number, tint: string) => (
    <div className="card" style={{ background: tint, border: "none" }}>
      <p className="s-label">{label}</p>
      <p style={{ fontFamily: "var(--serif)", fontSize: 38, lineHeight: 1.1 }}>{value}</p>
    </div>
  );

  return (
    <>
      <AdminNav active="overview" />
      <div className="app-shell">
        <p className="s-label">Admin</p>
        <h1 className="s-title" style={{ marginBottom: 24 }}>Overview</h1>

        <div className="grid-2" style={{ marginBottom: 16 }}>
          {stat("Total mothers", s.users, "var(--pink-pale)")}
          {stat("New this week", s.new_week, "var(--lav-pale)")}
        </div>
        <div className="grid-2" style={{ marginBottom: 16 }}>
          {stat("Premium", s.premium, "var(--gold-lt)")}
          {stat("Free", s.free, "var(--blue-pale)")}
        </div>
        <div className="grid-2" style={{ marginBottom: 16 }}>
          {stat("Weekly updates", s.updates, "var(--cream)")}
          {stat("Chat messages", s.chats, "var(--cream)")}
        </div>
        <div className="grid-2" style={{ marginBottom: 28 }}>
          {stat("Journal entries", s.journal, "var(--cream)")}
          {stat("Kick sessions", s.kicks, "var(--cream)")}
        </div>

        <div className="card">
          <p className="s-label">Weekly delivery</p>
          <h3 className="feat-title" style={{ marginBottom: 6 }}>Generate &amp; send this week&apos;s updates</h3>
          <p className="muted" style={{ marginBottom: 16 }}>
            Runs the same job a scheduler would: ensures every mother&apos;s current-week update exists and delivers it.
            Email is <strong>{emailConfigured() ? "configured ✓" : "not configured"}</strong>; WhatsApp is{" "}
            <strong>{whatsappConfigured() ? "configured ✓" : "not configured"}</strong>.
            {!emailConfigured() && !whatsappConfigured() ? " (Add SMTP / WhatsApp env vars to actually send.)" : ""}
          </p>
          <RunWeeklyButton />
          <p className="muted" style={{ marginTop: 14, fontSize: 11 }}>
            To automate: schedule <code>GET /api/cron/weekly?secret=$CRON_SECRET</code> (e.g. weekly via your host&apos;s cron).
          </p>
        </div>
      </div>
    </>
  );
}
