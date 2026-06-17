"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = { configured: boolean; instance: string; webhookUrl: string; publicWebhook: boolean };

async function call(action: string, extra?: Record<string, unknown>) {
  const res = await fetch("/api/admin/whatsapp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...extra }),
  });
  return res.json().catch(() => ({}));
}

function asDataUri(b64?: string): string | null {
  if (!b64) return null;
  return b64.startsWith("data:") ? b64 : `data:image/png;base64,${b64}`;
}

export default function WhatsAppConnect({ configured, instance, webhookUrl, publicWebhook }: Props) {
  const [busy, setBusy] = useState<string | null>(null);
  const [state, setState] = useState<string>("unknown");
  const [number, setNumber] = useState<string>("");
  const [qr, setQr] = useState<string | null>(null);
  const [pairing, setPairing] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const [testTo, setTestTo] = useState<string>("");
  const poll = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshStatus = useCallback(async () => {
    const r = await call("status");
    const s = r?.state?.instance?.state || r?.state?.state || "unknown";
    setState(s);
    const info = Array.isArray(r?.info) ? r.info[0] : r?.info;
    const owner = info?.ownerJid || info?.owner || info?.instance?.owner || "";
    if (owner) setNumber(String(owner).split("@")[0]);
    if (s === "open") {
      setQr(null);
      setPairing("");
      if (poll.current) {
        clearInterval(poll.current);
        poll.current = null;
      }
    }
    return s;
  }, []);

  useEffect(() => {
    if (configured) refreshStatus();
    return () => {
      if (poll.current) clearInterval(poll.current);
    };
  }, [configured, refreshStatus]);

  function startPolling() {
    if (poll.current) clearInterval(poll.current);
    poll.current = setInterval(refreshStatus, 3000);
  }

  async function initialise() {
    setBusy("create");
    setMsg("");
    const r = await call("create");
    if (!r.ok) setMsg(r?.create?.error || r?.error || "Could not initialise instance.");
    else setMsg("Instance ready. Now generate the QR and scan it with WhatsApp.");
    setBusy(null);
    refreshStatus();
  }

  async function showQr() {
    setBusy("connect");
    setMsg("");
    const r = await call("connect");
    const uri = asDataUri(r?.data?.base64 || r?.base64);
    setQr(uri);
    setPairing(r?.data?.pairingCode || r?.pairingCode || "");
    if (!uri && !(r?.data?.pairingCode || r?.pairingCode)) setMsg(r?.error || "No QR returned — is the instance created?");
    setBusy(null);
    startPolling();
  }

  async function disconnect() {
    setBusy("logout");
    await call("logout");
    setQr(null);
    setPairing("");
    setNumber("");
    setBusy(null);
    refreshStatus();
  }

  async function antiban() {
    setBusy("antiban");
    setMsg("");
    const r = await call("antiban");
    setMsg(r?.ok ? "✓ Anti-ban applied: rejects calls, ignores groups, human-like typing delays." : `Anti-ban failed: ${r?.error || "error"}`);
    setBusy(null);
  }

  async function sendTest() {
    setBusy("test");
    setMsg("");
    const r = await call("test", { to: testTo });
    setMsg(r?.ok ? "✓ Test message sent." : `Test failed: ${r?.error || "unknown error"}`);
    setBusy(null);
  }

  if (!configured) {
    return (
      <div className="card" style={{ maxWidth: 620 }}>
        <h3 className="feat-title" style={{ marginBottom: 8 }}>Evolution API not configured</h3>
        <p className="muted" style={{ marginBottom: 12 }}>
          Add these to your environment, then restart the app:
        </p>
        <pre style={{ background: "var(--lav-pale)", padding: 14, borderRadius: 10, fontSize: 12, overflowX: "auto" }}>
{`EVOLUTION_API_URL=https://your-evolution-host
EVOLUTION_API_KEY=your-global-api-key
EVOLUTION_INSTANCE=bumply
WHATSAPP_WEBHOOK_SECRET=<random hex>`}
        </pre>
      </div>
    );
  }

  const connected = state === "open";
  const badge =
    connected ? { t: "Connected", c: "var(--sage)" } : state === "connecting" ? { t: "Waiting for scan", c: "var(--pink)" } : { t: "Not connected", c: "var(--ink-muted)" };

  return (
    <div style={{ maxWidth: 620, display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <p className="s-label">Instance</p>
            <p style={{ fontFamily: "var(--serif)", fontSize: 20 }}>{instance}</p>
          </div>
          <span style={{ color: badge.c, fontWeight: 600, fontSize: 13 }}>● {badge.t}</span>
        </div>
        {connected && number && (
          <p className="muted" style={{ marginBottom: 12 }}>Connected number: <strong>+{number}</strong> 🎉</p>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {!connected && (
            <>
              <button className="btn-pink" onClick={initialise} disabled={busy !== null}>
                {busy === "create" ? "Initialising…" : "1 · Initialise instance"}
              </button>
              <button className="btn-ghost" onClick={showQr} disabled={busy !== null}>
                {busy === "connect" ? "Loading…" : "2 · Show QR code"}
              </button>
            </>
          )}
          <button className="btn-ghost" onClick={refreshStatus} disabled={busy !== null}>Refresh status</button>
          <button className="btn-ghost" onClick={antiban} disabled={busy !== null}>
            {busy === "antiban" ? "Applying…" : "🛡 Anti-ban settings"}
          </button>
          {connected && (
            <button className="btn-ghost" onClick={disconnect} disabled={busy !== null} style={{ color: "var(--pink)" }}>
              {busy === "logout" ? "Disconnecting…" : "Disconnect"}
            </button>
          )}
        </div>
        {msg && <p className="muted" style={{ marginTop: 12 }}>{msg}</p>}
      </div>

      {(qr || pairing) && !connected && (
        <div className="card" style={{ textAlign: "center" }}>
          <p className="s-label">Scan with WhatsApp</p>
          <p className="muted" style={{ marginBottom: 14 }}>
            WhatsApp → Settings → Linked Devices → Link a Device, then scan:
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {qr && <img src={qr} alt="WhatsApp QR code" width={260} height={260} style={{ margin: "0 auto", display: "block", borderRadius: 12 }} />}
          {pairing && (
            <p style={{ marginTop: 14 }}>
              Or enter pairing code: <strong style={{ fontSize: 18, letterSpacing: 2 }}>{pairing}</strong>
            </p>
          )}
          <p className="muted" style={{ marginTop: 14, fontSize: 12 }}>This page checks for connection automatically every few seconds.</p>
        </div>
      )}

      {connected && (
        <div className="card">
          <p className="s-label">Send a test message</p>
          <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
            <input
              value={testTo}
              onChange={(e) => setTestTo(e.target.value)}
              placeholder="2348012345678"
              style={{ flex: "1 1 200px" }}
            />
            <button className="btn-pink" onClick={sendTest} disabled={busy !== null || !testTo}>
              {busy === "test" ? "Sending…" : "Send test"}
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <p className="s-label">Inbound webhook</p>
        <p className="muted" style={{ margin: "6px 0 10px" }}>
          Two-way chat posts here. Set automatically when you initialise the instance.
        </p>
        <pre style={{ background: "var(--lav-pale)", padding: 12, borderRadius: 10, fontSize: 11, overflowX: "auto", margin: 0 }}>{webhookUrl}</pre>
        {!publicWebhook && (
          <p className="muted" style={{ marginTop: 10, color: "var(--pink)" }}>
            ⚠ This is a localhost URL — your Evolution server can&apos;t reach it. For inbound chat in dev, expose the app
            with a tunnel (e.g. ngrok) and set <code>PUBLIC_WEBHOOK_URL</code>, then re-initialise. Outbound sending works regardless.
          </p>
        )}
      </div>
    </div>
  );
}
