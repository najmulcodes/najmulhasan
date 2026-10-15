import { cfg } from "@/lib/admin/config";
import { assertSlug, devtoTags, originalFooter, parseFile, serialize } from "@/lib/admin/article-io";
import { getFile, putFile } from "@/lib/admin/github";
import { handle, HttpError, json, readJson, requireAdmin, requireSameOrigin } from "@/lib/admin/http";

export const dynamic = "force-dynamic";

export function POST(req: Request) {
  return handle(async () => {
    requireAdmin(req);
    requireSameOrigin(req);
    const apiKey = process.env.DEVTO_API_KEY;
    if (!apiKey) throw new HttpError(501, "DEVTO_API_KEY not set");

    const { slug, publish, force } = await readJson<{ slug?: unknown; publish?: unknown; force?: unknown }>(req, 1_000);
    assertSlug(slug);
    const c = cfg();
    const path = `${c.articlesDir}/${slug}.md`;
    const file = await getFile(path);
    if (!file) throw new HttpError(404, "Article not found");

    const { input, extra } = parseFile(slug, file.content);
    if (input.draft) throw new HttpError(409, "Publish the article on your site first: the canonical URL must be live.");
    const already = extra.syndication?.devto;
    if (already && force !== true) throw new HttpError(409, `Already cross-posted: ${already}`);

    const canonical = `${c.siteUrl}/blog/${slug}`;
    const res = await fetch(`${c.devtoApi}/articles`, {
      method: "POST",
      headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/vnd.forem.api-v1+json" },
      body: JSON.stringify({
        article: {
          title: input.title,
          body_markdown: input.body + originalFooter(canonical),
          published: publish === true,
          tags: devtoTags(input.tags),
          description: input.description.slice(0, 250),
          canonical_url: canonical,
        },
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new HttpError(502, `dev.to rejected the post (${res.status})`);
    const data = (await res.json()) as { url?: string };
    const url = data.url ?? "https://dev.to/dashboard";

    // Remember it so a second click can't create a duplicate.
    let persisted = true;
    try {
      await putFile(path, serialize(input, { ...extra, syndication: { ...(extra.syndication ?? {}), devto: url } }), `syndication: devto ${slug}`, file.sha);
    } catch (err) {
      persisted = false;
      console.error("[admin] could not persist syndication state", err);
    }
    return json({ ok: true, url, published: publish === true, persisted });
  });
}
