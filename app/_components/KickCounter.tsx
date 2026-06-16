"use client";
import { useEffect, useState } from "react";

const GOAL = 10;

export default function KickCounter() {
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [active]);

  function start() {
    setActive(true);
    setCount(0);
    const s = Date.now();
    setStartedAt(s);
    setNow(s);
  }

  async function finish(final: number, started: number) {
    setActive(false);
    setSaving(true);
    try {
      await fetch("/api/kicks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ started_at: new Date(started).toISOString(), completed_at: new Date().toISOString(), kicks: final }),
      });
      window.location.reload();
    } catch {
      setSaving(false);
    }
  }

  function kick() {
    const next = count + 1;
    setCount(next);
    if (next >= GOAL && startedAt) finish(next, startedAt);
  }

  const elapsed = startedAt ? Math.floor((now - startedAt) / 1000) : 0;
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="card">
      <p className="s-label">Kick counter</p>
      <h3 className="feat-title" style={{ marginBottom: 6 }}>Count to 10 movements</h3>
      <p className="muted" style={{ marginBottom: 18 }}>
        From the third trimester, feeling your baby move is reassuring. Tap each time you feel a kick, roll or flutter.
      </p>

      {!active ? (
        <button className="f-submit" style={{ maxWidth: 220 }} onClick={start} disabled={saving}>
          {saving ? "Saving…" : "Start counting 👣"}
        </button>
      ) : (
        <>
          <div style={{ textAlign: "center", margin: "10px 0 18px" }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 64, color: "var(--pink)", lineHeight: 1 }}>{count}<span className="muted" style={{ fontSize: 24 }}>/{GOAL}</span></div>
            <div className="muted">elapsed {mm}:{ss}</div>
          </div>
          <button
            onClick={kick}
            className="btn-pink"
            style={{ width: "100%", padding: "22px", fontSize: 16, justifyContent: "center" }}
          >
            I felt a kick 🌸
          </button>
          <button className="btn-ghost" style={{ marginTop: 12 }} onClick={() => startedAt && finish(count, startedAt)}>
            End &amp; save
          </button>
        </>
      )}
    </div>
  );
}
