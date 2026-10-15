import { cfg } from "./config";
import { HttpError } from "./errors";

type GhFile = { content: string; sha: string };

async function gh(path: string, init: RequestInit = {}): Promise<Response> {
  const c = cfg();
  const token = process.env.GITHUB_TOKEN;
  if (!token || !c.repo) throw new HttpError(500, "Server misconfigured: GITHUB_TOKEN / GITHUB_REPO");
  const res = await fetch(`${c.githubApi}/repos/${c.repo}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  return res;
}

function fail(res: Response, what: string): never {
  if (res.status === 401 || res.status === 403) throw new HttpError(502, `GitHub refused ${what}: check GITHUB_TOKEN permissions (contents: read/write)`);
  if (res.status === 409 || res.status === 422) throw new HttpError(409, "File changed on GitHub since you loaded it. Reload and re-apply your edit.");
  throw new HttpError(502, `GitHub error while ${what} (${res.status})`);
}

export async function listArticleNames(): Promise<string[]> {
  const c = cfg();
  const res = await gh(`/contents/${c.articlesDir}?ref=${encodeURIComponent(c.branch)}`);
  if (res.status === 404) return [];
  if (!res.ok) fail(res, "listing articles");
  const items = (await res.json()) as { name: string; type: string }[];
  return items.filter((i) => i.type === "file" && i.name.endsWith(".md")).map((i) => i.name);
}

export async function getFile(path: string): Promise<GhFile | null> {
  const c = cfg();
  const res = await gh(`/contents/${path}?ref=${encodeURIComponent(c.branch)}`);
  if (res.status === 404) return null;
  if (!res.ok) fail(res, "reading a file");
  const data = (await res.json()) as { content: string; sha: string; encoding: string };
  return { content: Buffer.from(data.content, "base64").toString("utf8"), sha: data.sha };
}

export async function putFile(path: string, text: string, message: string, sha?: string): Promise<{ sha: string }> {
  const c = cfg();
  const res = await gh(`/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: Buffer.from(text, "utf8").toString("base64"),
      branch: c.branch,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) fail(res, "saving");
  const data = (await res.json()) as { content: { sha: string } };
  return { sha: data.content.sha };
}
