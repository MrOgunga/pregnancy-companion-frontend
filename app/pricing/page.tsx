import { getSession } from "@/lib/session";
import { getMotherById } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import AppHeader from "../_components/AppHeader";
import SubscribeButton from "../_components/SubscribeButton";

export const dynamic = "force-dynamic";

export default async function Pricing() {
  const session = await getSession();
  const mother = session ? await getMotherById(session.sub) : null;
  const settings = await getSettings();
  const features = { journal: settings.journal_enabled, tools: settings.tools_enabled, chat: settings.chat_enabled };

  return (
    <>
      {mother ? <AppHeader plan={mother.plan} features={features} /> : null}
      <div className="app-shell">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p className="s-label">Plans</p>
          <h1 className="s-title">Choose your <em>care</em></h1>
          <p className="muted" style={{ maxWidth: 460, margin: "8px auto 0" }}>
            Free during beta — no card required. Premium unlocks meal plans, partner notes and unlimited chat.
          </p>
        </div>

        <div className="grid-2" style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="card">
            <span className="badge badge-free">Free</span>
            <h2 className="feat-title" style={{ marginTop: 12 }}>Weekly basics</h2>
            <p style={{ fontFamily: "var(--serif)", fontSize: 34 }}>₦0<span className="muted" style={{ fontSize: 14 }}> /month</span></p>
            <ul style={{ listStyle: "none", margin: "16px 0", display: "flex", flexDirection: "column", gap: 8 }}>
              <li className="muted">🌸 Weekly baby development</li>
              <li className="muted">📅 Your week, calculated</li>
              <li className="muted">📖 Update history</li>
            </ul>
            {mother && mother.plan === "free" ? (
              <p className="muted">Your current plan</p>
            ) : mother ? (
              <SubscribeButton plan="free" label="Switch to Free" className="btn-ghost" />
            ) : (
              <a className="btn-ghost" href="/#register">Get started</a>
            )}
          </div>

          <div className="card" style={{ border: "1px solid var(--pink)" }}>
            <span className="badge badge-premium">Premium</span>
            <h2 className="feat-title" style={{ marginTop: 12 }}>The full companion</h2>
            <p style={{ fontFamily: "var(--serif)", fontSize: 34 }}>{settings.premium_price}<span className="muted" style={{ fontSize: 14 }}> /month</span></p>
            <ul style={{ listStyle: "none", margin: "16px 0", display: "flex", flexDirection: "column", gap: 8 }}>
              <li className="muted">🥗 Personalised 7-day meal plans</li>
              <li className="muted">💌 Partner notes</li>
              <li className="muted">💬 Unlimited chat with Bumply</li>
              <li className="muted">🎯 Milestone celebrations</li>
            </ul>
            {mother && mother.plan === "premium" ? (
              <p className="muted">✓ You&apos;re on Premium</p>
            ) : mother ? (
              <SubscribeButton plan="premium" label="Subscribe (demo — no payment) ✨" />
            ) : (
              <a className="btn-pink" href="/#register">Create account</a>
            )}
            {mother ? <p className="f-note">Demo: activates instantly, no card charged.</p> : null}
          </div>
        </div>
      </div>
    </>
  );
}
