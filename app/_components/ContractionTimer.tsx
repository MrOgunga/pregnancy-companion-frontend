"use client";
import { useEffect, useState } from "react";
import { normalizeLang } from "@/lib/languages";
import { t } from "@/lib/i18n";

type C = { start: number; end: number };
const KEY = "bumply_contractions";

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

export default function ContractionTimer({ lang }: { lang?: string | null }) {
  const L = normalizeLang(lang);
  const [list, setList] = useState<C[]>([]);
  const [running, setRunning] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setList(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    if (running == null) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [running]);

  function persist(next: C[]) {
    setList(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next.slice(-50)));
    } catch {}
  }

  function toggle() {
    if (running == null) {
      const s = Date.now();
      setRunning(s);
      setNow(s);
    } else {
      persist([...list, { start: running, end: Date.now() }]);
      setRunning(null);
    }
  }

  function clear() {
    persist([]);
  }

  const recent = [...list].reverse().slice(0, 10);
  const liveDur = running != null ? Math.floor((now - running) / 1000) : 0;

  return (
    <div className="card">
      <p className="s-label">{t("contraction.label", L)}</p>
      <h3 className="feat-title" style={{ marginBottom: 6 }}>{t("contraction.title", L)}</h3>
      <p className="muted" style={{ marginBottom: 18 }}>{t("contraction.desc", L)}</p>

      {running != null && (
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: 48, color: "var(--pink)" }}>{fmt(liveDur)}</div>
          <div className="muted">{t("contraction.inprogress", L)}</div>
        </div>
      )}

      <button
        onClick={toggle}
        className={running != null ? "btn-ghost" : "btn-pink"}
        style={{ width: "100%", padding: "20px", fontSize: 16, justifyContent: "center", ...(running != null ? { border: "1px solid var(--pink)", color: "var(--pink)" } : {}) }}
      >
        {running != null ? t("contraction.stop", L) : t("contraction.start", L)}
      </button>

      {recent.length > 0 && (
        <table style={{ width: "100%", marginTop: 18, fontSize: 13, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--ink-muted)" }}>
              <th style={{ padding: "6px 4px", fontWeight: 500 }}>{t("contraction.started", L)}</th>
              <th style={{ padding: "6px 4px", fontWeight: 500 }}>{t("contraction.length", L)}</th>
              <th style={{ padding: "6px 4px", fontWeight: 500 }}>{t("contraction.apart", L)}</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((c, i) => {
              const idx = list.length - 1 - i; // index in chronological list
              const prev = list[idx - 1];
              const apart = prev ? Math.floor((c.start - prev.start) / 1000) : null;
              return (
                <tr key={c.start} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "6px 4px" }}>{new Date(c.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                  <td style={{ padding: "6px 4px" }}>{fmt(Math.floor((c.end - c.start) / 1000))}</td>
                  <td style={{ padding: "6px 4px" }}>{apart != null ? fmt(apart) : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {list.length > 0 && (
        <button className="btn-ghost" style={{ marginTop: 12, fontSize: 12 }} onClick={clear}>
          {t("contraction.clear", L)}
        </button>
      )}
    </div>
  );
}
