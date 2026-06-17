import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { findHospitals, geocodePlace } from "@/lib/hospitals";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const b = await req.json().catch(() => ({}));
  let lat = Number(b.lat);
  let lon = Number(b.lon);
  let label = "your location";

  if ((Number.isNaN(lat) || Number.isNaN(lon)) && b.place) {
    const g = await geocodePlace(String(b.place));
    if (!g) return NextResponse.json({ error: "Couldn't find that place — try a town or area name." }, { status: 400 });
    lat = g.lat; lon = g.lon; label = g.label;
  }
  if (Number.isNaN(lat) || Number.isNaN(lon)) return NextResponse.json({ error: "Location required." }, { status: 400 });

  const radius = Math.min(Math.max(Number(b.radius) || 8000, 1000), 25000);
  try {
    const hospitals = await findHospitals(lat, lon, radius);
    return NextResponse.json({ ok: true, hospitals, label });
  } catch {
    return NextResponse.json({ error: "Search failed — please try again." }, { status: 502 });
  }
}
