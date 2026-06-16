"use client";
import { useEffect, useState } from "react";

// Shown while Bumply generates the week's personal notes in the background.
// Polls for readiness; nudges generation if the background job didn't land; reloads when ready.
export default function WeekExtras() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let alive = true;
    let secs = 0;
    let forced = false;
    const timer = setInterval(() => {
      secs += 1;
      setElapsed(secs);
    }, 1000);

    async function loop() {
      while (alive) {
        try {
          const r = await fetch("/api/generate", { cache: "no-store" });
          const d = await r.json();
          if (d.ready) {
            window.location.reload();
            return;
          }
        } catch {
          /* retry */
        }
        // If the background job hasn't produced anything after ~12s, kick it ourselves.
        if (!forced && secs >= 12) {
          forced = true;
          fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }).catch(() => {});
        }
        await new Promise((res) => setTimeout(res, 2500));
      }
    }
    loop();
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="card" style={{ textAlign: "center", padding: "36px 28px" }}>
      <div style={{ width: 40, height: 40, border: "3px solid var(--lav-pale)", borderTopColor: "var(--pink)", borderRadius: "50%", margin: "0 auto 16px", animation: "spin .9s linear infinite" }} />
      <h3 className="feat-title">Bumply is writing your week…</h3>
      <p className="muted">
        Your personal meal plan, partner notes and affirmation are on their way{elapsed > 8 ? " — almost there" : ""}. 🌸
      </p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
