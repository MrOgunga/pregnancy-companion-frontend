"use client";
import { useState } from "react";

type Clinician = { id: string; email: string; name: string; created_at: string };

export default function AdminClinicians({ clinicians }: { clinicians: Clinician[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function add() {
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/admin/clinician", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setMsg(data.error || "Could not add."); return; }
    window.location.reload();
  }

  return (
    <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="card">
        <p className="s-label">Add a clinician</p>
        <p className="muted" style={{ marginBottom: 12 }}>They sign in at <code>/clinic/login</code> to review flagged vitals.</p>
        <div className="fg"><label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr Ada" /></div>
        <div className="fg"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="fg"><label>Temporary password</label><input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="at least 8 characters" /></div>
        <button className="f-submit" style={{ maxWidth: 180 }} onClick={add} disabled={busy || !name || !email || password.length < 8}>
          {busy ? "Adding…" : "Add clinician"}
        </button>
        {msg && <p className="f-error">{msg}</p>}
      </div>

      <div className="card">
        <p className="s-label">Clinicians ({clinicians.length})</p>
        {clinicians.length === 0 ? (
          <p className="muted" style={{ marginTop: 8 }}>None yet.</p>
        ) : (
          <div style={{ marginTop: 8 }}>
            {clinicians.map((c) => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 14 }}>{c.name}</span>
                <span className="muted" style={{ fontSize: 13 }}>{c.email}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
