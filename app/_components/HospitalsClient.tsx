"use client";
import { useEffect, useState } from "react";

type H = {
  id: string; name: string; kind: string; lat: number; lon: number;
  distanceKm: number; phone?: string; address?: string; deliveryRecommended: boolean;
};
type State = "locating" | "loading" | "manual" | "done";

export default function HospitalsClient() {
  const [state, setState] = useState<State>("locating");
  const [list, setList] = useState<H[]>([]);
  const [place, setPlace] = useState("");
  const [label, setLabel] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => { locate(); }, []);

  function locate() {
    if (typeof navigator === "undefined" || !navigator.geolocation) { setState("manual"); return; }
    setState("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => search({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setState("manual"),
      { timeout: 8000, maximumAge: 300000 }
    );
  }

  async function search(body: { lat?: number; lon?: number; place?: string }) {
    setState("loading");
    setErr("");
    const res = await fetch("/api/hospitals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { setErr(data.error || "Search failed"); setState("manual"); return; }
    setList(data.hospitals || []);
    setLabel(data.label || "");
    setState("done");
  }

  const recommended = list.find((h) => h.deliveryRecommended);

  function card(h: H, highlight = false) {
    const dirs = `https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lon}`;
    return (
      <div key={h.id} className="card" style={highlight ? { border: "1px solid var(--pink)", background: "var(--pink-pale)" } : undefined}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <p style={{ fontFamily: "var(--serif)", fontSize: 18 }}>
            {h.kind === "hospital" ? "🏥" : "➕"} {h.name}
          </p>
          <span className="muted" style={{ fontSize: 13, whiteSpace: "nowrap" }}>{h.distanceKm.toFixed(1)} km</span>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "6px 0" }}>
          <span className="chip" style={{ fontSize: 11 }}>{h.kind}</span>
          {h.deliveryRecommended && <span className="chip" style={{ fontSize: 11, background: "var(--gold-lt)", borderColor: "var(--gold)" }}>⭐ good for delivery</span>}
        </div>
        {h.address && <p className="muted" style={{ fontSize: 13 }}>{h.address}</p>}
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <a className="btn-pink" href={dirs} target="_blank" rel="noreferrer">Directions →</a>
          {h.phone && <a className="btn-ghost" href={`tel:${h.phone.replace(/\s/g, "")}`}>Call</a>}
        </div>
      </div>
    );
  }

  return (
    <div>
      {(state === "locating" || state === "loading") && (
        <p className="muted">{state === "locating" ? "📍 Finding your location…" : "🔎 Searching nearby facilities…"}</p>
      )}

      {state === "manual" && (
        <div className="card" style={{ marginBottom: 20 }}>
          <p className="s-label">Where are you?</p>
          <p className="muted" style={{ marginBottom: 12 }}>{err || "Enter your town or area, or allow location access."}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="e.g. Yaba, Lagos" style={{ flex: "1 1 200px" }} onKeyDown={(e) => e.key === "Enter" && place && search({ place })} />
            <button className="btn-pink" onClick={() => place && search({ place })} disabled={!place}>Search</button>
            <button className="btn-ghost" onClick={locate}>Use my location</button>
          </div>
        </div>
      )}

      {state === "done" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <p className="muted" style={{ fontSize: 13 }}>Near {label || "you"} · {list.length} found</p>
            <button className="btn-ghost" onClick={() => setState("manual")} style={{ fontSize: 12 }}>Change location</button>
          </div>

          {recommended && (
            <div style={{ marginBottom: 22 }}>
              <p className="s-label">Recommended for delivery</p>
              <div style={{ marginTop: 8 }}>{card(recommended, true)}</div>
            </div>
          )}

          {list.length === 0 ? (
            <p className="muted">No facilities found nearby — try a wider area name.</p>
          ) : (
            <>
              <p className="s-label">All nearby facilities</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>{list.map((h) => card(h))}</div>
            </>
          )}
          <p className="muted" style={{ fontSize: 11, marginTop: 16 }}>
            Data from OpenStreetMap. Always confirm a facility offers maternity care before your due date.
          </p>
        </>
      )}
    </div>
  );
}
