import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-insecure-secret-change-me");
export const CLINICIAN_COOKIE = "bumply_clinician";

export type ClinicianSession = { sub: string; email: string; name: string };

export async function createClinicianSession(c: ClinicianSession) {
  const token = await new SignJWT({ ...c, role: "clinician" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
  const jar = await cookies();
  jar.set(CLINICIAN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getClinician(): Promise<ClinicianSession | null> {
  const jar = await cookies();
  const t = jar.get(CLINICIAN_COOKIE)?.value;
  if (!t) return null;
  try {
    const { payload } = await jwtVerify(t, secret);
    if (payload.role !== "clinician") return null;
    return { sub: String(payload.sub), email: String(payload.email), name: String(payload.name) };
  } catch {
    return null;
  }
}

export async function destroyClinicianSession() {
  const jar = await cookies();
  jar.delete(CLINICIAN_COOKIE);
}
