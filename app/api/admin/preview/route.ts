import { handle, json, readJson, requireAdmin, requireSameOrigin } from "@/lib/admin/http";
import { renderMarkdown } from "@/lib/markdown";

export const dynamic = "force-dynamic";

export function POST(req: Request) {
  return handle(async () => {
    requireAdmin(req);
    requireSameOrigin(req);
    const { markdown } = await readJson<{ markdown?: unknown }>(req, 250_000);
    const html = await renderMarkdown(typeof markdown === "string" ? markdown : "");
    return json({ html });
  });
}
