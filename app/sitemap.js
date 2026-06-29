export default function sitemap() {
  const baseUrl = "https://najmulhasan.navicore.co";

  // Real routes that exist in app/projects/[slug]/page.js
  const projectSlugs = [
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

  const projectRoutes = projectSlugs.map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projectRoutes,
  ];
}
