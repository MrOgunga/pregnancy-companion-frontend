"use client";
import { useState } from "react";

// Demo: flips plan without payment. Real billing replaces the fetch target later.
export default function SubscribeButton({
  plan,
  label,
  href = "/dashboard",
  className = "f-submit",
}: {
  plan: "free" | "premium";
  label: string;
  href?: string;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  async function go() {
    setBusy(true);
    await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    window.location.href = href;
  }
  return (
    <button className={className} onClick={go} disabled={busy}>
      {busy ? "One moment…" : label}
    </button>
  );
}
