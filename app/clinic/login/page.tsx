"use client";
import { useState } from "react";

export default function ClinicLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/clinic/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Sign in failed");
      window.location.href = "/clinic";
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <a className="logo" href="/" style={{ marginBottom: 24 }}>
          <div className="logo-dot" />
          Bumply <span style={{ color: "var(--ink-muted)", fontSize: 13, marginLeft: 4 }}>Clinic</span>
        </a>
        <h3 className="fc-head">Clinician sign in</h3>
        <p className="fc-sub">Review flagged vitals from your patients.</p>
        <div className="fg">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
        </div>
        <div className="fg">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
        </div>
        <button className="f-submit" onClick={submit} disabled={busy}>{busy ? "Signing in…" : "Sign In"}</button>
        {error && <p className="f-error">{error}</p>}
      </div>
    </div>
  );
}
