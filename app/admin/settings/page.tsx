import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/adminSession";
import { getSettings } from "@/lib/settings";
import AdminNav from "../../_components/AdminNav";
import AdminSettings from "../../_components/AdminSettings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const settings = await getSettings();

  return (
    <>
      <AdminNav active="settings" />
      <div className="app-shell">
        <p className="s-label">Admin</p>
        <h1 className="s-title" style={{ marginBottom: 8 }}>Settings</h1>
        <p className="muted" style={{ marginBottom: 24 }}>Configure pricing, the AI model, delivery day, and which features are on.</p>
        <AdminSettings settings={settings} envModel={process.env.NVIDIA_MODEL || "meta/llama-3.1-8b-instruct"} />
      </div>
    </>
  );
}
