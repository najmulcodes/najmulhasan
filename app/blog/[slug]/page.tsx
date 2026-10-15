import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getAllArticles, getArticle } from "@/lib/articles";
import { renderMarkdown } from "@/lib/markdown";
import { blog } from "@/lib/blog-config";
import JsonLd from "@/components/JsonLd";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  const url = `${blog.url}/blog/${a.slug}`;
  return {
    title: a.seoTitle ?? a.title,
    description: a.description,
    keywords: [a.keyword, ...a.tags],
    alternates: { canonical: url },
    authors: [{ name: blog.author.name, url: blog.url }],
    openGraph: {
      type: "article", url, title: a.title, description: a.description, siteName: blog.name,
      publishedTime: a.date, modifiedTime: a.updated ?? a.date, authors: [blog.author.name], tags: a.tags,
    },
    twitter: { card: "summary_large_image", title: a.title, description: a.description },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const html = await renderMarkdown(a.content);
  const url = `${blog.url}/blog/${a.slug}`;

  return (
    <>
      <article>
        <header className="b-art-head">
          <p className="b-crumb"><Link href="/blog">Articles</Link> /</p>
          <h1 className="b-h1">{a.title}</h1>
          <p className="b-lede">{a.description}</p>
          <p className="b-meta">
            By <Link href="/">{blog.author.name}</Link> · <time dateTime={a.date}>{formatDate(a.date)}</time> ·{" "}
            {a.readingMinutes} min read
          </p>
        </header>
        <div className="b-body" dangerouslySetInnerHTML={{ __html: html }} />
        <aside className="b-author">
          <strong>{blog.author.name}</strong>
          <span>{blog.author.role}</span>
          <p>{blog.author.bio}</p>
          <Link href="/">Portfolio →</Link>
        </aside>
      </article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: a.title,
          description: a.description,
          datePublished: a.date,
          dateModified: a.updated ?? a.date,
          keywords: a.tags.join(", "),
          inLanguage: "en",
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          author: { "@type": "Person", "@id": blog.personId, name: blog.author.name, url: blog.url },
          publisher: { "@type": "Organization", name: blog.org.name, url: blog.org.url },
          image: `${url}/opengraph-image`,
        }}
      />
    </>
  );
}
