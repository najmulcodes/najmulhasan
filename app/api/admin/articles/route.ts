import { cfg } from "@/lib/admin/config";
import { assertSlug, parseFile, serialize, validate } from "@/lib/admin/article-io";
import { getFile, listArticleNames, putFile } from "@/lib/admin/github";
import { handle, HttpError, json, readJson, requireAdmin, requireSameOrigin } from "@/lib/admin/http";

export const dynamic = "force-dynamic";

const today = () => new Date().toISOString().slice(0, 10);

export function GET(req: Request) {
  return handle(async () => {
    requireAdmin(req);
    const c = cfg();
    const slug = new URL(req.url).searchParams.get("slug");

    if (slug) {
      assertSlug(slug);
      const file = await getFile(`${c.articlesDir}/${slug}.md`);
      if (!file) throw new HttpError(404, "Article not found");
      const { input, extra } = parseFile(slug, file.content);
      return json({ article: input, syndication: extra.syndication ?? {}, sha: file.sha });
    }

    const names = (await listArticleNames()).slice(0, 100);
    const items = await Promise.all(
      names.map(async (name) => {
        const s = name.replace(/\.md$/, "");
        const f = await getFile(`${c.articlesDir}/${name}`);
        if (!f) return null;
        const { input, extra } = parseFile(s, f.content);
        return { slug: s, title: input.title, date: input.date, draft: input.draft, tags: input.tags, syndication: extra.syndication ?? {} };
      }),
    );
    const list = items.filter(Boolean).sort((a, b) => b!.date.localeCompare(a!.date));
    return json({ articles: list });
  });
}

export function POST(req: Request) {
  return handle(async () => {
    requireAdmin(req);
    requireSameOrigin(req);
    const raw = await readJson<Record<string, unknown>>(req, 700_000); // Bangla is 3 bytes/char
    const input = validate(raw);
    const sha = typeof raw.sha === "string" && /^[a-f0-9]{40}$/.test(raw.sha) ? raw.sha : undefined;
    const c = cfg();
    const path = `${c.articlesDir}/${input.slug}.md`;

    const existing = await getFile(path);
    if (existing && !sha) throw new HttpError(409, "An article with this slug already exists");
    if (existing && sha && existing.sha !== sha) {
      throw new HttpError(409, "File changed on GitHub since you loaded it. Reload and re-apply your edit.");
    }

    const prev = existing ? parseFile(input.slug, existing.content) : null;
    const extra = { ...(prev?.extra ?? {}) };
    if (prev && !prev.input.draft && !input.draft && input.date !== today()) extra.updated = today();

    const verb = input.draft ? (prev && !prev.input.draft ? "unpublish" : "draft") : prev && !prev.input.draft ? "update" : "publish";
    const out = await putFile(path, serialize(input, extra), `${verb}: ${input.slug}`, existing?.sha);
    return json({ ok: true, sha: out.sha, url: `${c.siteUrl}/blog/${input.slug}`, draft: input.draft });
  });
}
