import { cfg } from "@/lib/admin/config";
import { assertSlug } from "@/lib/admin/article-io";
import { handle, json, requireAdmin } from "@/lib/admin/http";

export const dynamic = "force-dynamic";

/** Is the article reachable on the live site yet? (deploy finished) */
export function GET(req: Request) {
  return handle(async () => {
    requireAdmin(req);
    const slug = new URL(req.url).searchParams.get("slug");
    assertSlug(slug);
    const url = `${cfg().siteUrl}/blog/${slug}`;
    try {
      const res = await fetch(`${url}?_=${Date.now()}`, { redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(8000) });
      return json({ status: res.status, live: res.status === 200, url });
    } catch {
      return json({ status: 0, live: false, url });
    }
  });
}
