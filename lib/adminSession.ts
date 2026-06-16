import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-insecure-secret-change-me");
export const ADMIN_COOKIE = "nerve_admin";

export async function createAdminSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
  const c = await cookies();
  c.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  const t = c.get(ADMIN_COOKIE)?.value;
  if (!t) return false;
  try {
    const { payload } = await jwtVerify(t, secret);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function destroyAdminSession() {
  const c = await cookies();
  c.delete(ADMIN_COOKIE);
}
