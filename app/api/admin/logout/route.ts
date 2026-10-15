import { clearCookie } from "@/lib/admin/auth";
import { handle, json, requireSameOrigin } from "@/lib/admin/http";

export const dynamic = "force-dynamic";

export function POST(req: Request) {
  return handle(async () => {
    requireSameOrigin(req);
    return json({ ok: true }, 200, { "Set-Cookie": clearCookie() });
  });
}
