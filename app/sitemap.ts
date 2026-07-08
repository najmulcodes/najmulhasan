import type { MetadataRoute } from "next";

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

  const projectSlugs = [
    "navicore-software",
    "devfolio-analyzer",
    "livecollab",
    "petcare-system",
    "microtask-platform",
    "badar-uddin-welfare",
    "care.xyz",
    "gatherly",
    "clubsphere",
    "bookhub",
  ];

  const projectPages = projectSlugs.map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...projectPages];
}