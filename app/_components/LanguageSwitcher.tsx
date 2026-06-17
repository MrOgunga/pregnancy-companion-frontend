"use client";
import { useState } from "react";
import { LANGUAGES, normalizeLang } from "@/lib/languages";

export default function LanguageSwitcher({
  lang,
  style,
  compact,
}: {
  lang?: string | null;
  style?: React.CSSProperties;
  compact?: boolean;
}) {
  const L = normalizeLang(lang);
  const [busy, setBusy] = useState(false);

  async function change(next: string) {
    if (next === L || busy) return;
    setBusy(true);
    await fetch("/api/lang", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: next }),
    });
    window.location.reload();
  }

  return (
    <select
      aria-label="Language"
      value={L}
      disabled={busy}
      onChange={(e) => change(e.target.value)}
      style={{
        fontSize: 12,
        padding: compact ? "5px 8px" : "8px 12px",
        borderRadius: 8,
        border: "1px solid var(--border)",
        background: "var(--cream)",
        color: "var(--ink-mid)",
        cursor: "pointer",
        ...style,
      }}
    >
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {compact ? l.native : `🌐 ${l.native}`}
        </option>
      ))}
    </select>
  );
}
