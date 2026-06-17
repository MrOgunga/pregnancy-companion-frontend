"use client";
import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

type State = "loading" | "unsupported" | "default" | "denied" | "granted";

export default function EnableNotifications() {
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported");
      return;
    }
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => {
        if (sub && Notification.permission === "granted") setState("granted");
        else setState(Notification.permission as State);
      })
      .catch(() => setState(Notification.permission as State));
  }, []);

  async function enable() {
    setBusy(true);
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setState(perm as State);
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const { key } = await fetch("/api/push/key").then((r) => r.json());
      if (!key) {
        setState("unsupported");
        return;
      }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key) as unknown as BufferSource,
      });
      const json = sub.toJSON();
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
      });
      setState("granted");
    } catch {
      // leave state as-is
    } finally {
      setBusy(false);
    }
  }

  if (state === "loading" || state === "unsupported" || state === "granted") return null;

  return (
    <div
      className="card"
      style={{
        marginBottom: 20,
        display: "flex",
        gap: 14,
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        background: "var(--pink-pale)",
        border: "1px solid var(--pink-lt)",
      }}
    >
      <div>
        <p style={{ fontFamily: "var(--serif)", fontSize: 18 }}>🔔 Turn on weekly reminders</p>
        <p className="muted" style={{ fontSize: 13 }}>
          {state === "denied"
            ? "Notifications are blocked — enable them in your browser settings to get reminders."
            : "Get a nudge when your new week is ready, appointment reminders & a daily tip."}
        </p>
      </div>
      {state !== "denied" && (
        <button className="btn-pink" onClick={enable} disabled={busy} style={{ whiteSpace: "nowrap" }}>
          {busy ? "Enabling…" : "Enable"}
        </button>
      )}
    </div>
  );
}
