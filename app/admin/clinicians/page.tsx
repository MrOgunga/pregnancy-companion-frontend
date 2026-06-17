import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/adminSession";
import { listClinicians } from "@/lib/queries";
import AdminNav from "../../_components/AdminNav";
import AdminClinicians from "../../_components/AdminClinicians";

export const dynamic = "force-dynamic";

export default async function AdminCliniciansPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const clinicians = await listClinicians();
  return (
    <>
      <AdminNav active="clinicians" />
      <div className="app-shell">
        <p className="s-label">Admin</p>
        <h1 className="s-title" style={{ marginBottom: 8 }}>Clinicians</h1>
        <p className="muted" style={{ marginBottom: 24 }}>Create accounts for clinicians who review flagged vitals in the <code>/clinic</code> portal.</p>
        <AdminClinicians clinicians={clinicians} />
      </div>
    </>
  );
}
