import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/adminSession";
import { evolutionConfigured, EVOLUTION_INSTANCE, webhookUrl } from "@/lib/evolution";
import AdminNav from "../../_components/AdminNav";
import WhatsAppConnect from "../../_components/WhatsAppConnect";

export const dynamic = "force-dynamic";

export default async function AdminWhatsAppPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const configured = evolutionConfigured();
  const publicWebhook = !/localhost|127\.0\.0\.1/.test(webhookUrl());

  return (
    <>
      <AdminNav active="whatsapp" />
      <div className="app-shell">
        <p className="s-label">Admin</p>
        <h1 className="s-title" style={{ marginBottom: 8 }}>WhatsApp</h1>
        <p className="muted" style={{ marginBottom: 24 }}>
          Connect a WhatsApp number through your Evolution API server. Once linked, moms receive their
          weekly updates on WhatsApp and can chat two-way with Bumply.
        </p>
        <WhatsAppConnect
          configured={configured}
          instance={EVOLUTION_INSTANCE}
          webhookUrl={webhookUrl()}
          publicWebhook={publicWebhook}
        />
      </div>
    </>
  );
}
