import { cfg } from "./config";
import { HttpError } from "./errors";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function accessToken(): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.BLOGGER_CLIENT_ID ?? "",
      client_secret: process.env.BLOGGER_CLIENT_SECRET ?? "",
      refresh_token: process.env.BLOGGER_REFRESH_TOKEN ?? "",
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as { access_token?: string; error?: string };
  if (!res.ok || !data.access_token) {
    throw new HttpError(
      502,
      `Google refused the Blogger token (${data.error ?? res.status}). If the OAuth app is in "Testing" mode, tokens expire after 7 days: publish it to production and re-run scripts/blogger-auth.mjs.`,
    );
  }
  return data.access_token;
}

/** Bangla summary + link to the English original. Never the full article (duplicate content). */
export function bloggerBody(summary: string, title: string, url: string): string {
  const paras = summary
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`);
  return [...paras, `<p><a href="${esc(url)}">পূর্ণ আর্টিকেল ইংরেজিতে পড়ুন: ${esc(title)}</a></p>`].join("\n");
}

export async function insertBloggerPost(args: { title: string; content: string; labels: string[] }): Promise<string> {
  const blogId = process.env.BLOGGER_BLOG_ID;
  if (!blogId) throw new HttpError(501, "BLOGGER_BLOG_ID not set");
  const token = await accessToken();
  const res = await fetch(`${cfg().bloggerApi}/blogs/${encodeURIComponent(blogId)}/posts?isDraft=false`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "blogger#post", title: args.title, content: args.content, labels: args.labels }),
    signal: AbortSignal.timeout(20000),
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("[admin] blogger insert failed", res.status, await res.text().catch(() => ""));
    throw new HttpError(502, `Blogger rejected the post (${res.status}). Check BLOGGER_BLOG_ID and that the Blogger API is enabled.`);
  }
  const data = (await res.json()) as { url?: string };
  return data.url ?? "https://www.blogger.com";
}
