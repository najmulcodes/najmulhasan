import { createSession, passwordOk, sessionCookie } from "@/lib/admin/auth";
import { clientIp, handle, HttpError, json, readJson, requireSameOrigin } from "@/lib/admin/http";
import { allow } from "@/lib/admin/rate-limit";

export const dynamic = "force-dynamic";

export function POST(req: Request) {
  return handle(async () => {
    requireSameOrigin(req);
    if (!(await allow(`adm:login:${clientIp(req)}`, 5, 600))) {
      throw new HttpError(429, "Too many attempts. Try again in 10 minutes.");
    }
    const { password } = await readJson<{ password?: unknown }>(req, 2_000);
    if (typeof password !== "string" || !passwordOk(password)) {
      await new Promise((r) => setTimeout(r, 700)); // slow down guessing
      throw new HttpError(401, "Wrong password");
    }
    return json({ ok: true }, 200, { "Set-Cookie": sessionCookie(createSession()) });
  });
}
