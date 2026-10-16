import { cfg } from "@/lib/admin/config";
import { assertSlug, originalFooter, parseFile, serialize } from "@/lib/admin/article-io";
import { getFile, putFile } from "@/lib/admin/github";
import { handle, HttpError, json, readJson, requireAdmin, requireSameOrigin } from "@/lib/admin/http";

export const dynamic = "force-dynamic";

type GqlResponse<T> = { data?: T; errors?: { message: string }[] };

async function gql<T>(query: string, variables: Record<string, unknown>, token: string): Promise<T> {
  const res = await fetch(cfg().hashnodeApi, {
    method: "POST",
    // Hashnode takes the raw token in Authorization (no "Bearer" prefix).
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(20000),
    cache: "no-store",
  });
  if (res.status === 401 || res.status === 403) throw new HttpError(502, "Hashnode rejected HASHNODE_TOKEN");
  if (!res.ok) throw new HttpError(502, `Hashnode error (${res.status})`);
  const body = (await res.json()) as GqlResponse<T>;
  if (body.errors?.length) throw new HttpError(502, `Hashnode: ${body.errors[0].message}`);
  if (!body.data) throw new HttpError(502, "Hashnode returned no data");
  return body.data;
}

async function publicationId(token: string): Promise<string> {
  const fromEnv = process.env.HASHNODE_PUBLICATION_ID?.trim();
  if (fromEnv) return fromEnv;
  const data = await gql<{ me: { publications: { edges: { node: { id: string } }[] } } }>(
    "query { me { publications(first: 5) { edges { node { id } } } } }",
    {},
    token,
  );
  const id = data.me?.publications?.edges?.[0]?.node?.id;
  if (!id) throw new HttpError(502, "No Hashnode publication found. Create a blog on Hashnode or set HASHNODE_PUBLICATION_ID.");
  return id;
}

export function POST(req: Request) {
  return handle(async () => {
    requireAdmin(req);
    requireSameOrigin(req);
    const token = process.env.HASHNODE_TOKEN;
    if (!token) throw new HttpError(501, "HASHNODE_TOKEN not set");

    const { slug, force } = await readJson<{ slug?: unknown; force?: unknown }>(req, 1_000);
    assertSlug(slug);
    const c = cfg();
    const path = `${c.articlesDir}/${slug}.md`;
    const file = await getFile(path);
    if (!file) throw new HttpError(404, "Article not found");

    const { input, extra } = parseFile(slug, file.content);
    if (input.draft) throw new HttpError(409, "Publish the article on your site first: the canonical URL must be live.");
    const already = extra.syndication?.hashnode;
    if (already && force !== true) throw new HttpError(409, `Already posted: ${already}`);

    const canonical = `${c.siteUrl}/blog/${slug}`;
    const pubId = await publicationId(token);
    const data = await gql<{ publishPost: { post: { id: string; url: string } } }>(
      `mutation PublishPost($input: PublishPostInput!) {
        publishPost(input: $input) { post { id url } }
      }`,
      {
        input: {
          title: input.title,
          subtitle: input.description.slice(0, 150),
          publicationId: pubId,
          contentMarkdown: input.body + originalFooter(canonical),
          originalArticleURL: canonical,
          tags: input.tags.slice(0, 5).map((t) => ({ slug: t, name: t })),
        },
      },
      token,
    );
    const url = data.publishPost?.post?.url;
    if (!url) throw new HttpError(502, "Hashnode did not return a post URL");

    // Remember it so a second click can't create a duplicate.
    let persisted = true;
    try {
      await putFile(
        path,
        serialize(input, { ...extra, syndication: { ...(extra.syndication ?? {}), hashnode: url } }),
        `syndication: hashnode ${slug}`,
        file.sha,
      );
    } catch (err) {
      persisted = false;
      console.error("[admin] could not persist syndication state", err);
    }
    return json({ ok: true, url, persisted });
  });
}
