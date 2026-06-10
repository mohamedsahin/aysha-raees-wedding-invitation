import { SignJWT, jwtVerify } from "jose";

// Admin auth: a single set of credentials from env, sealed into a signed JWT
// stored in an HTTP-only cookie. Edge-compatible (jose + Web Crypto) so it can
// be checked from middleware.

export const ADMIN_COOKIE = "wedding_admin";

const secret = () => {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set (see .env.local)");
  return new TextEncoder().encode(s);
};

export function checkCredentials(email: string, password: string): boolean {
  const e = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const p = process.env.ADMIN_PASSWORD ?? "";
  return email.trim().toLowerCase() === e && password === p && !!e && !!p;
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}
