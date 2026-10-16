import matter from "gray-matter";
import { HttpError } from "./errors";

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TAG_RE = /^[a-z0-9][a-z0-9-]{0,30}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export type ArticleInput = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  date: string;
  tags: string[];
  keyword: string;
  draft: boolean;
  linkedin: string;
  bnTitle: string; // Bangla title for the Blogger summary post (optional)
  bnSummary: string; // Bangla summary for the Blogger summary post (optional)
  body: string;
};
export type Syndication = { devto?: string; hashnode?: string; blogger?: string };
export type Extra = Record<string, unknown> & { syndication?: Syndication };

export function assertSlug(slug: unknown): asserts slug is string {
  if (typeof slug !== "string" || slug.length > 80 || !SLUG_RE.test(slug)) throw new HttpError(400, "Invalid slug");
}

const str = (v: unknown, name: string, max: number, required = false): string => {
  const s = typeof v === "string" ? v.trim() : "";
  if (required && !s) throw new HttpError(400, `${name} is required`);
  if (s.length > max) throw new HttpError(400, `${name} is too long (max ${max})`);
  return s;
};

export function validate(raw: unknown): ArticleInput {
  const r = (raw ?? {}) as Record<string, unknown>;
  assertSlug(r.slug);
  const date = str(r.date, "date", 10, true);
  if (!DATE_RE.test(date) || Number.isNaN(Date.parse(date))) throw new HttpError(400, "date must be YYYY-MM-DD");
  const tags = Array.isArray(r.tags) ? r.tags.map((t) => String(t).trim().toLowerCase()) : [];
  if (tags.length > 8 || tags.some((t) => !TAG_RE.test(t))) throw new HttpError(400, "tags: up to 8, lowercase letters/digits/hyphens");
  const body = typeof r.body === "string" ? r.body.replace(/\r\n/g, "\n") : "";
  if (!body.trim()) throw new HttpError(400, "body is required");
  if (body.length > 200_000) throw new HttpError(400, "body is too long");
  return {
    slug: r.slug,
    title: str(r.title, "title", 120, true),
    seoTitle: str(r.seoTitle, "seoTitle", 70),
    description: str(r.description, "description", 300, true),
    date,
    tags,
    keyword: str(r.keyword, "keyword", 100, true),
    draft: r.draft === true,
    linkedin: str(r.linkedin, "linkedin", 3000),
    bnTitle: str(r.bnTitle, "bnTitle", 150),
    bnSummary: str(r.bnSummary, "bnSummary", 1500),
    body,
  };
}

export function serialize(a: ArticleInput, extra: Extra = {}): string {
  const data: Record<string, unknown> = { title: a.title };
  if (a.seoTitle) data.seoTitle = a.seoTitle;
  data.description = a.description;
  data.date = a.date;
  if (extra.updated) data.updated = extra.updated;
  data.tags = a.tags;
  data.keyword = a.keyword;
  data.draft = a.draft;
  if (a.linkedin) data.linkedin = a.linkedin;
  if (a.bnTitle) data.bnTitle = a.bnTitle;
  if (a.bnSummary) data.bnSummary = a.bnSummary;
  if (extra.syndication && Object.keys(extra.syndication).length) data.syndication = extra.syndication;
  return matter.stringify(a.body.trim() + "\n", data);
}

const toDate = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? ""));

export function parseFile(slug: string, text: string): { input: ArticleInput; extra: Extra } {
  const { data, content } = matter(text);
  const input: ArticleInput = {
    slug,
    title: String(data.title ?? ""),
    seoTitle: String(data.seoTitle ?? ""),
    description: String(data.description ?? ""),
    date: toDate(data.date),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    keyword: String(data.keyword ?? ""),
    draft: data.draft === true,
    linkedin: String(data.linkedin ?? ""),
    bnTitle: String(data.bnTitle ?? ""),
    bnSummary: String(data.bnSummary ?? ""),
    body: content.trim(),
  };
  const extra: Extra = {};
  if (data.updated) extra.updated = toDate(data.updated);
  if (data.syndication && typeof data.syndication === "object") extra.syndication = data.syndication as Syndication;
  return { input, extra };
}

export const originalFooter = (url: string) =>
  `\n\n---\n\n*Originally published at [${url.replace(/^https?:\/\//, "")}](${url}).*\n`;

export const devtoTags = (tags: string[]) =>
  tags.map((t) => t.replace(/[^a-z0-9]/g, "")).filter(Boolean).slice(0, 4);
