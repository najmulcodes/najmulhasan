import { COOKIE, readCookie, verifySession } from "./auth";
import { HttpError } from "./errors";

export { HttpError };

export function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });
}

export async function handle(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof HttpError) return json({ error: err.message }, err.status);
    console.error("[admin]", err);
    return json({ error: "Internal error" }, 500);
  }
}

export function requireAdmin(req: Request): void {
  if (!verifySession(readCookie(req, COOKIE))) throw new HttpError(401, "Unauthorized");
}

/** CSRF defence for state-changing calls (on top of SameSite=Strict). */
export function requireSameOrigin(req: Request): void {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  let ok = false;
  try {
    ok = !!origin && !!host && new URL(origin).host === host;
  } catch {
    ok = false;
  }
  if (!ok) throw new HttpError(403, "Bad origin");
}

export async function readJson<T>(req: Request, maxBytes = 300_000): Promise<T> {
  if (!req.headers.get("content-type")?.includes("application/json")) {
    throw new HttpError(415, "Expected application/json");
  }
  const text = await req.text();
  if (text.length > maxBytes) throw new HttpError(413, "Payload too large");
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new HttpError(400, "Invalid JSON");
  }
}

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
