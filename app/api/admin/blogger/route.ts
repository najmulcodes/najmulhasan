import { cfg } from "@/lib/admin/config";
import { assertSlug, parseFile, serialize } from "@/lib/admin/article-io";
import { bloggerBody, insertBloggerPost } from "@/lib/admin/blogger";
import { getFile, putFile } from "@/lib/admin/github";
import { handle, HttpError, json, readJson, requireAdmin, requireSameOrigin } from "@/lib/admin/http";

export const dynamic = "force-dynamic";

export function POST(req: Request) {
  return handle(async () => {
    requireAdmin(req);
    requireSameOrigin(req);
    if (!process.env.BLOGGER_REFRESH_TOKEN || !process.env.BLOGGER_CLIENT_ID || !process.env.BLOGGER_CLIENT_SECRET || !process.env.BLOGGER_BLOG_ID) {
      throw new HttpError(501, "BLOGGER_* env vars not set");
    }

    const { slug, force } = await readJson<{ slug?: unknown; force?: unknown }>(req, 1_000);
    assertSlug(slug);
    const c = cfg();
    const path = `${c.articlesDir}/${slug}.md`;
    const file = await getFile(path);
    if (!file) throw new HttpError(404, "Article not found");

    const { input, extra } = parseFile(slug, file.content);
    if (input.draft) throw new HttpError(409, "Publish the article on your site first: the link must be live.");
    if (!input.bnTitle || !input.bnSummary) {
      throw new HttpError(409, "Add a Bangla title and Bangla summary, then click Update published, before posting to Blogger.");
    }
    const already = extra.syndication?.blogger;
    if (already && force !== true) throw new HttpError(409, `Already posted: ${already}`);

    const canonical = `${c.siteUrl}/blog/${slug}`;
    const url = await insertBloggerPost({
      title: input.bnTitle,
      content: bloggerBody(input.bnSummary, input.title, canonical),
      labels: input.tags.slice(0, 5),
    });

    let persisted = true;
    try {
      await putFile(
        path,
        serialize(input, { ...extra, syndication: { ...(extra.syndication ?? {}), blogger: url } }),
        `syndication: blogger ${slug}`,
        file.sha,
      );
    } catch (err) {
      persisted = false;
      console.error("[admin] could not persist syndication state", err);
    }
    return json({ ok: true, url, persisted });
  });
}
