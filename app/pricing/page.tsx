import { getSession } from "@/lib/session";
import { getMotherById } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { getUiLang } from "@/lib/serverLang";
import { t } from "@/lib/i18n";
import AppHeader from "../_components/AppHeader";
import SubscribeButton from "../_components/SubscribeButton";

export const dynamic = "force-dynamic";

export default async function Pricing() {
  const session = await getSession();
  const mother = session ? await getMotherById(session.sub) : null;
  const settings = await getSettings();
  const features = { journal: settings.journal_enabled, tools: settings.tools_enabled, chat: settings.chat_enabled };
  const L = await getUiLang();

  return (
    <>
      {mother ? <AppHeader plan={mother.plan} lang={mother.language} features={features} /> : null}
      <div className="app-shell">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p className="s-label">{t("pricing.label", L)}</p>
          <h1 className="s-title">{t("pricing.title", L)}</h1>
          <p className="muted" style={{ maxWidth: 460, margin: "8px auto 0" }}>{t("pricing.sub", L)}</p>
        </div>

        <div className="grid-2" style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="card">
            <span className="badge badge-free">{t("pricing.free", L)}</span>
            <h2 className="feat-title" style={{ marginTop: 12 }}>{t("pricing.weeklybasics", L)}</h2>
            <p style={{ fontFamily: "var(--serif)", fontSize: 34 }}>₦0<span className="muted" style={{ fontSize: 14 }}> {t("common.month", L)}</span></p>
            <ul style={{ listStyle: "none", margin: "16px 0", display: "flex", flexDirection: "column", gap: 8 }}>
              <li className="muted">{t("pricing.free1", L)}</li>
              <li className="muted">{t("pricing.free2", L)}</li>
              <li className="muted">{t("pricing.free3", L)}</li>
            </ul>
            {mother && mother.plan === "free" ? (
              <p className="muted">{t("pricing.current", L)}</p>
            ) : mother ? (
              <SubscribeButton plan="free" label={t("pricing.switchfree", L)} className="btn-ghost" />
            ) : (
              <a className="btn-ghost" href="/#register">{t("pricing.getstarted", L)}</a>
            )}
          </div>

          <div className="card" style={{ border: "1px solid var(--pink)" }}>
            <span className="badge badge-premium">{t("pricing.premium", L)}</span>
            <h2 className="feat-title" style={{ marginTop: 12 }}>{t("pricing.fullcompanion", L)}</h2>
            <p style={{ fontFamily: "var(--serif)", fontSize: 34 }}>{settings.premium_price}<span className="muted" style={{ fontSize: 14 }}> {t("common.month", L)}</span></p>
            <ul style={{ listStyle: "none", margin: "16px 0", display: "flex", flexDirection: "column", gap: 8 }}>
              <li className="muted">{t("pricing.prem1", L)}</li>
              <li className="muted">{t("pricing.prem2", L)}</li>
              <li className="muted">{t("pricing.prem3", L)}</li>
              <li className="muted">{t("pricing.prem4", L)}</li>
            </ul>
            {mother && mother.plan === "premium" ? (
              <p className="muted">{t("pricing.onpremium", L)}</p>
            ) : mother ? (
              <SubscribeButton plan="premium" label={t("pricing.subscribe", L)} />
            ) : (
              <a className="btn-pink" href="/#register">{t("pricing.createacct", L)}</a>
            )}
            {mother ? <p className="f-note">{t("pricing.demonote", L)}</p> : null}
          </div>
        </div>
      </div>
    </>
  );
}
