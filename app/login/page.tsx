"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Sign in failed");
      const next = new URLSearchParams(window.location.search).get("next") || "/dashboard";
      window.location.href = next;
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
          Bumply
        </a>
        <h3 className="fc-head">Welcome back, mama</h3>
        <p className="fc-sub">Sign in to see this week&apos;s update.</p>
        <div className="fg">
          <label>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="amara@email.com"
            onKeyDown={(e) => e.key === "Enter" && submit()} />
        </div>
        <div className="fg">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password"
            onKeyDown={(e) => e.key === "Enter" && submit()} />
        </div>
        <button className="f-submit" onClick={submit} disabled={busy}>
          {busy ? "Signing in…" : "Sign In"}
        </button>
        {error && <p className="f-error">{error}</p>}
        <p className="f-note" style={{ marginTop: 18 }}>
          New here? <a className="auth-link" href="/#register">Create an account</a>
        </p>
      </div>
    </div>
  );
}
