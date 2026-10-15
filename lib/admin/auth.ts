import crypto from "node:crypto";
import { HttpError } from "./errors";

export const COOKIE = "adm_session";
const TTL_SEC = 12 * 60 * 60;

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET ?? "";
  if (s.length < 32) throw new HttpError(500, "Server misconfigured: ADMIN_SESSION_SECRET (32+ chars)");
  return s;
}

const sign = (v: string) => crypto.createHmac("sha256", secret()).update(v).digest("base64url");

const safeEqual = (a: string, b: string) => {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
};

export function passwordOk(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (expected.length < 16) throw new HttpError(500, "Server misconfigured: ADMIN_PASSWORD (16+ chars)");
  return safeEqual(input, expected);
}

export function createSession(): string {
  const exp = String(Date.now() + TTL_SEC * 1000);
  return `${exp}.${sign(exp)}`;
}

export function verifySession(token: string | undefined): boolean {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp)) return false;
  try {
    if (!safeEqual(sig, sign(exp))) return false;
  } catch {
    return false;
  }
  return Number(exp) > Date.now();
}

export function readCookie(req: Request, name: string): string | undefined {
  const raw = req.headers.get("cookie") ?? "";
  for (const part of raw.split(";")) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return undefined;
}

const flags = () => `Path=/; HttpOnly; SameSite=Strict${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;

export const sessionCookie = (token: string) => `${COOKIE}=${encodeURIComponent(token)}; Max-Age=${TTL_SEC}; ${flags()}`;
export const clearCookie = () => `${COOKIE}=; Max-Age=0; ${flags()}`;
