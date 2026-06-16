"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit() {
    setErr("");
    setBusy(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) window.location.href = "/admin";
    else {
      setBusy(false);
      setErr("Incorrect password.");
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <a className="logo" href="/" style={{ marginBottom: 24 }}>
          <div className="logo-dot" />
          Bumply <span style={{ color: "var(--ink-muted)", fontSize: 14, marginLeft: 4 }}>Admin</span>
        </a>
        <h3 className="fc-head">Admin sign in</h3>
        <p className="fc-sub">Enter the admin password to manage Bumply.</p>
        <div className="fg">
          <label>Password</label>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && submit()} />
        </div>
        <button className="f-submit" onClick={submit} disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        {err && <p className="f-error">{err}</p>}
      </div>
    </div>
  );
}
