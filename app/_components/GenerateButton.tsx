"use client";
import { useState } from "react";

export default function GenerateButton({ label = "Prepare this week's update ✨" }: { label?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function go() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Failed");
      window.location.reload();
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : "Failed");
    }
  }
  return (
    <div>
      <button className="f-submit" style={{ maxWidth: 320 }} onClick={go} disabled={busy}>
        {busy ? "Bumply is writing your update…" : label}
      </button>
      {error && <p className="f-error">{error}</p>}
    </div>
  );
}
