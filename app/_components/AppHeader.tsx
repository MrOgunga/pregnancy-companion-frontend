"use client";

import { normalizeLang } from "@/lib/languages";
import { t } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

type Features = { journal: boolean; tools: boolean; chat: boolean };

export default function AppHeader({
  plan,
  active,
  features = { journal: true, tools: true, chat: true },
  lang,
}: {
  plan: "free" | "premium";
  active?: string;
  features?: Features;
  lang?: string | null;
}) {
  const L = normalizeLang(lang);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  const link = (href: string, label: string, key: string) => (
    <a href={href} style={active === key ? { color: "var(--pink)" } : undefined}>
      {label}
    </a>
  );

  return (
    <div className="app-bar">
      <div className="app-bar-inner">
        <a className="logo" href="/dashboard">
          <div className="logo-dot" />
          Bumply
        </a>
        <div className="app-nav">
          {link("/dashboard", t("nav.dashboard", L), "dashboard")}
          {features.journal && link("/journal", t("nav.journal", L), "journal")}
          {features.tools && link("/tools", t("nav.tools", L), "tools")}
          {features.chat && link("/chat", t("nav.chat", L), "chat")}
          {link("/account", t("nav.account", L), "account")}
          <span className={"badge " + (plan === "premium" ? "badge-premium" : "badge-free")}>{plan}</span>
          <LanguageSwitcher lang={L} compact />
          <button className="btn-ghost" onClick={logout} style={{ textTransform: "uppercase", fontSize: 12 }}>
            {t("nav.signout", L)}
          </button>
        </div>
      </div>
    </div>
  );
}
