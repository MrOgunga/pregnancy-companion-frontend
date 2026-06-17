import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/adminSession";
import { pushConfigured } from "@/lib/push";
import AdminNav from "../../_components/AdminNav";
import AdminNotify from "../../_components/AdminNotify";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const configured = pushConfigured();

  return (
    <>
      <AdminNav active="notifications" />
      <div className="app-shell">
        <p className="s-label">Admin</p>
        <h1 className="s-title" style={{ marginBottom: 8 }}>Notifications</h1>
        <p className="muted" style={{ marginBottom: 24 }}>
          Broadcast a push to all moms, or trigger the scheduled jobs by hand.
        </p>
        {!configured && (
          <div className="card" style={{ maxWidth: 560, marginBottom: 18, borderColor: "var(--pink)" }}>
            <p className="muted">⚠ Push isn&apos;t configured — set <code>VAPID_PUBLIC_KEY</code> / <code>VAPID_PRIVATE_KEY</code> in your env.</p>
          </div>
        )}
        <AdminNotify />
      </div>
    </>
  );
}
