import { cfg, indexnowKey } from "@/lib/admin/config";
import { handle, json, requireAdmin } from "@/lib/admin/http";

export const dynamic = "force-dynamic";

export function GET(req: Request) {
  return handle(async () => {
    requireAdmin(req);
    const c = cfg();
    return json({
      siteUrl: c.siteUrl,
      gscProperty: c.gscProperty,
      devto: !!process.env.DEVTO_API_KEY,
      indexnow: !!indexnowKey(),
    });
  });
}
