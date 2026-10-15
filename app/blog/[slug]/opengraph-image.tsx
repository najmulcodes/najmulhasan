import { ImageResponse } from "next/og";
import { getAllArticles, getArticle } from "@/lib/articles";
import { blog } from "@/lib/blog-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Article cover";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  const title = a?.title ?? blog.name;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#040911", color: "#F0F4FF", padding: 72 }}>
        <div style={{ display: "flex", fontSize: 30, color: "#00E5C3", letterSpacing: 2 }}>{"<C/> NAJMULHASAN"}</div>
        <div style={{ display: "flex", fontSize: title.length > 70 ? 52 : 62, fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
        <div style={{ display: "flex", fontSize: 30, justifyContent: "space-between", width: "100%" }}>
          <span>{blog.author.name} · {blog.org.name}</span>
          <span style={{ color: "#D4A843" }}>{a ? `${a.readingMinutes} min read` : ""}</span>
        </div>
      </div>
    ),
    size,
  );
}
