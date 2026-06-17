"use client";
import { normalizeLang } from "@/lib/languages";
import { t } from "@/lib/i18n";

type Features = { journal: boolean; tools: boolean; chat: boolean };

export default function BottomNav({ active, features, lang }: { active?: string; features: Features; lang?: string | null }) {
  const L = normalizeLang(lang);
  const items = [
    { key: "dashboard", href: "/dashboard", icon: "🏠", label: t("nav.dashboard", L) },
    features.chat ? { key: "chat", href: "/chat", icon: "💬", label: t("nav.chat", L) } : null,
    { key: "vitals", href: "/vitals", icon: "🩺", label: t("nav.vitals", L) },
    features.journal ? { key: "journal", href: "/journal", icon: "📔", label: t("nav.journal", L) } : null,
    { key: "account", href: "/account", icon: "👤", label: t("nav.account", L) },
  ].filter(Boolean) as { key: string; href: string; icon: string; label: string }[];

  return (
    <nav className="bottom-nav">
      {items.map((it) => (
        <a key={it.key} href={it.href} className={"bn-item" + (active === it.key ? " active" : "")}>
          <span className="bn-icon">{it.icon}</span>
          <span className="bn-label">{it.label}</span>
        </a>
      ))}
    </nav>
  );
}
