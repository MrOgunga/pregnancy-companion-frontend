import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/adminSession";
import { listAllMothers } from "@/lib/queries";
import AdminNav from "../../_components/AdminNav";
import AdminUsers, { type AdminUserRow } from "../../_components/AdminUsers";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const mothers = await listAllMothers();
  const rows: AdminUserRow[] = mothers.map((m) => ({
    id: m.id,
    full_name: m.full_name,
    email: m.email,
    current_week: m.current_week,
    trimester: m.trimester,
    plan: m.plan,
    phone: m.phone,
    created_at: m.created_at,
  }));

  return (
    <>
      <AdminNav active="users" />
      <div className="app-shell">
        <p className="s-label">Admin</p>
        <h1 className="s-title" style={{ marginBottom: 8 }}>Users</h1>
        <p className="muted" style={{ marginBottom: 24 }}>{rows.length} registered · change plan or remove an account.</p>
        <AdminUsers users={rows} />
      </div>
    </>
  );
}
