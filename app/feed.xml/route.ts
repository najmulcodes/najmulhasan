import { getAllArticles } from "@/lib/articles";
import { blog } from "@/lib/blog-config";

export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = getAllArticles()
    .map((a) => {
      const url = `${blog.url}/blog/${a.slug}`;
      return `<item><title>${esc(a.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(a.date + "T08:00:00Z").toUTCString()}</pubDate><description>${esc(a.description)}</description>${a.tags.map((t) => `<category>${esc(t)}</category>`).join("")}</item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${esc(blog.name)} — Articles</title><link>${blog.url}/blog</link><description>${esc(blog.tagline)}</description><language>en</language><atom:link href="${blog.url}/feed.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
