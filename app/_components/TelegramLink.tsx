"use client";
import { useState } from "react";
import { normalizeLang } from "@/lib/languages";
import { t } from "@/lib/i18n";

export default function TelegramLink({
  linked,
  code,
  botUser,
  lang,
}: {
  linked: boolean;
  code: string;
  botUser: string;
  lang?: string | null;
}) {
  const L = normalizeLang(lang);
  const [copied, setCopied] = useState(false);
  const deepLink = `https://t.me/${botUser}?start=${code}`;

  function copy() {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <p className="s-label">✈️ {t("account.telegram", L)}</p>
      {linked ? (
        <p className="muted" style={{ marginTop: 6, color: "var(--sage)" }}>{t("account.telegramLinked", L)}</p>
      ) : (
        <>
          <p className="muted" style={{ margin: "6px 0 14px" }}>{t("account.telegramSub", L)}</p>
          <a className="btn-pink" href={deepLink} target="_blank" rel="noreferrer" style={{ display: "inline-flex", marginBottom: 14 }}>
            {t("account.telegramOpen", L)}
          </a>
          <div className="fg" style={{ margin: 0 }}>
            <label>{t("account.telegramCode", L)}</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input readOnly value={code} onFocus={(e) => e.currentTarget.select()} style={{ fontFamily: "monospace", letterSpacing: 2, fontSize: 16 }} />
              <button className="btn-ghost" onClick={copy} style={{ whiteSpace: "nowrap" }}>{copied ? "✓ Copied" : "Copy"}</button>
            </div>
            <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>Open @{botUser} on Telegram and paste this code (or tap the button above).</p>
          </div>
        </>
      )}
    </div>
  );
}
