import type { MetadataRoute } from "next";
import { projects } from "./projects/[slug]/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://najmulhasan.navicore.co";
  const now = new Date();

  const staticPages = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  ];

  // Sourced directly from app/projects/[slug]/data.js — the same object
  // generateStaticParams uses — instead of a separately hand-maintained
  // list. The old hardcoded list here was already missing "railmate" and
  // had silently drifted out of sync with the real project data.
  const projectPages = Object.keys(projects).map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...projectPages];
}