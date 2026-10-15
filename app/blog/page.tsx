import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, getAllArticles } from "@/lib/articles";
import { blog } from "@/lib/blog-config";

export const metadata: Metadata = {
  title: "Articles",
  description: `Engineering articles by ${blog.name}: Next.js, Supabase, React Native, serverless architecture and AI-assisted tools.`,
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const articles = getAllArticles();
  return (
    <>
      <h1 className="b-h1">Articles</h1>
      <p className="b-lede">{blog.tagline}</p>
      {articles.map((a) => (
        <article key={a.slug} className="b-card">
          <p className="b-meta">
            <time dateTime={a.date}>{formatDate(a.date)}</time> · {a.readingMinutes} min read
            {a.draft && <span className="b-draft">DRAFT</span>}
          </p>
          <h2>
            <Link href={`/blog/${a.slug}`}>{a.title}</Link>
          </h2>
          <p>{a.description}</p>
          <ul className="b-tags">
            {a.tags.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </article>
      ))}
    </>
  );
}
