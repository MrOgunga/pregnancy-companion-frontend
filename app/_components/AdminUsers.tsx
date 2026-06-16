"use client";
import { useState } from "react";

export type AdminUserRow = {
  id: string;
  full_name: string;
  email: string;
  current_week: number;
  trimester: string | null;
  plan: "free" | "premium";
  phone: string | null;
  created_at: string;
};

export default function AdminUsers({ users }: { users: AdminUserRow[] }) {
  const [busy, setBusy] = useState("");

  async function act(id: string, action: string, plan?: string) {
    setBusy(id);
    await fetch("/api/admin/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action, plan }),
    });
    window.location.reload();
  }

  function del(id: string, name: string) {
    if (confirm(`Delete ${name} and all of their data? This cannot be undone.`)) act(id, "delete");
  }

  if (users.length === 0) return <p className="muted">No users yet.</p>;

  return (
    <div className="card" style={{ overflowX: "auto", padding: 0 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 720 }}>
        <thead>
          <tr style={{ textAlign: "left", color: "var(--ink-muted)", background: "var(--cream)" }}>
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>Week</th>
            <th style={th}>Plan</th>
            <th style={th}>Joined</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderTop: "1px solid var(--border)" }}>
              <td style={td}>{u.full_name}</td>
              <td style={td}>{u.email}</td>
              <td style={td}>{u.current_week} <span className="muted">({u.trimester})</span></td>
              <td style={td}>
                <span className={"badge " + (u.plan === "premium" ? "badge-premium" : "badge-free")}>{u.plan}</span>
              </td>
              <td style={td}>{new Date(u.created_at).toLocaleDateString()}</td>
              <td style={{ ...td, whiteSpace: "nowrap" }}>
                <button
                  className="chip"
                  style={{ cursor: "pointer", marginRight: 6 }}
                  disabled={busy === u.id}
                  onClick={() => act(u.id, "plan", u.plan === "premium" ? "free" : "premium")}
                >
                  {u.plan === "premium" ? "↓ Free" : "↑ Premium"}
                </button>
                <button
                  className="chip"
                  style={{ cursor: "pointer", color: "#c0392b", borderColor: "#e8b0a8" }}
                  disabled={busy === u.id}
                  onClick={() => del(u.id, u.full_name)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = { padding: "12px 14px", fontWeight: 500 };
const td: React.CSSProperties = { padding: "12px 14px" };
