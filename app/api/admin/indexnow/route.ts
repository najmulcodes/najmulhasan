import { cfg, indexnowKey } from "@/lib/admin/config";
import { assertSlug } from "@/lib/admin/article-io";
import { handle, HttpError, json, readJson, requireAdmin, requireSameOrigin } from "@/lib/admin/http";

export const dynamic = "force-dynamic";

/** Notifies Bing/Yandex/Seznam via IndexNow. Google does not use IndexNow. */
export function POST(req: Request) {
  return handle(async () => {
    requireAdmin(req);
    requireSameOrigin(req);
    const key = indexnowKey();
    if (!key) throw new HttpError(501, "INDEXNOW_KEY not set (8-128 chars: letters, digits, hyphen)");
    const { slug } = await readJson<{ slug?: unknown }>(req, 1_000);
    assertSlug(slug);
    const c = cfg();
    const res = await fetch(c.indexnowApi, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(c.siteUrl).hostname,
        key,
        keyLocation: `${c.siteUrl}/indexnow-key.txt`,
        urlList: [`${c.siteUrl}/blog/${slug}`, `${c.siteUrl}/blog`],
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (res.status !== 200 && res.status !== 202) throw new HttpError(502, `IndexNow rejected the request (${res.status})`);
    return json({ ok: true, status: res.status });
  });
}
