"use client";
import { useState } from "react";

type Hit = { id: string; title: string; source: string; content: string };

export default function LibraryClient({ placeholder, suggestions }: { placeholder: string; suggestions: string[] }) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[] | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(query?: string) {
    const term = (query ?? q).trim();
    if (!term) return;
    if (query) setQ(query);
    setBusy(true);
    const res = await fetch("/api/search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ q: term }) });
    const data = await res.json().catch(() => ({ hits: [] }));
    setHits(data.hits || []);
    setBusy(false);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} style={{ flex: "1 1 220px" }} onKeyDown={(e) => e.key === "Enter" && run()} />
        <button className="btn-pink" onClick={() => run()} disabled={busy || !q.trim()}>{busy ? "Searching…" : "Search"}</button>
      </div>

      {hits === null && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {suggestions.map((s) => (
            <button key={s} className="chip" style={{ cursor: "pointer", background: "var(--cream)" }} onClick={() => run(s)}>{s}</button>
          ))}
        </div>
      )}

      {hits !== null && (
        hits.length === 0 ? (
          <p className="muted">No results — try different words.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {hits.map((h) => (
              <div key={h.id} className="card">
                <p style={{ fontFamily: "var(--serif)", fontSize: 18 }}>{h.title}</p>
                <p style={{ marginTop: 6, fontSize: 14 }}>{h.content}</p>
                {h.source && <p className="muted" style={{ fontSize: 11, marginTop: 8 }}>Source: {h.source}</p>}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
