"use client";

type Features = { journal: boolean; tools: boolean; chat: boolean };

export default function AppHeader({
  plan,
  active,
  features = { journal: true, tools: true, chat: true },
}: {
  plan: "free" | "premium";
  active?: string;
  features?: Features;
}) {
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
          {link("/dashboard", "Dashboard", "dashboard")}
          {features.journal && link("/journal", "Journal", "journal")}
          {features.tools && link("/tools", "Tools", "tools")}
          {features.chat && link("/chat", "Chat", "chat")}
          {link("/account", "Account", "account")}
          <span className={"badge " + (plan === "premium" ? "badge-premium" : "badge-free")}>{plan}</span>
          <button className="btn-ghost" onClick={logout} style={{ textTransform: "uppercase", fontSize: 12 }}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
