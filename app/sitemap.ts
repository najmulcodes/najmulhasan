import type { MetadataRoute } from "next";
import { projects } from "./projects/[slug]/data";
import { getAllArticles } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://najmulhasan.navicore.co";
  const now = new Date();
  const articles = getAllArticles();

  const staticPages = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly" as const, priority: 1 },
    {
      url: `${baseUrl}/blog`,
      lastModified: articles[0] ? new Date(articles[0].updated ?? articles[0].date) : now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
  ];

  // Sourced directly from app/projects/[slug]/data.js — the same object
  // generateStaticParams uses — instead of a separately hand-maintained list.
  const projectPages = Object.keys(projects).map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const articlePages = articles.map((a) => ({
    url: `${baseUrl}/blog/${a.slug}`,
    lastModified: new Date(a.updated ?? a.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...projectPages, ...articlePages];
}
