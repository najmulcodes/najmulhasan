import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const DIR = path.join(process.cwd(), "content", "articles");

export type ArticleMeta = {
  slug: string;
  title: string; // H1
  seoTitle?: string; // <title>, keep <= 45 chars (site template adds " | Najmul Hasan")
  description: string;
  date: string; // YYYY-MM-DD
  updated?: string;
  tags: string[];
  keyword: string;
  readingMinutes: number;
  draft: boolean;
};
export type Article = ArticleMeta & { content: string };

const toDate = (v: unknown): string => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v));

function parse(file: string): Article {
  const slug = file.replace(/\.md$/, "");
  const { data, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
  for (const k of ["title", "description", "date", "keyword"]) {
    if (!data[k]) throw new Error(`content/articles/${file}: missing front matter "${k}"`);
  }
  return {
    slug,
    title: String(data.title),
    seoTitle: data.seoTitle ? String(data.seoTitle) : undefined,
    description: String(data.description),
    date: toDate(data.date),
    updated: data.updated ? toDate(data.updated) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    keyword: String(data.keyword),
    readingMinutes: Math.max(1, Math.round(content.trim().split(/\s+/).length / 200)),
    draft: data.draft === true,
    content,
  };
}

export function getAllArticles(): Article[] {
  const showDrafts = process.env.NODE_ENV !== "production";
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parse)
    .filter((a) => showDrafts || !a.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticle(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

export function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  });
}
