import { projects } from "./data";
import ProjectDetailClient from "./ProjectDetailClient";

// Previously this route had zero per-page metadata (the whole file was a
// "use client" component, and generateMetadata only works in Server
// Components) — so all 10 project pages inherited the identical homepage
// title/description. That's a real SEO problem: duplicate titles across
// pages actively hurt indexing. Splitting into this Server Component
// (metadata) + ProjectDetailClient (interactivity) fixes it.

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects[slug];

  if (!project) {
    return {
      title: "Project Not Found | Najmul Hasan",
      robots: { index: false, follow: true },
    };
  }

  const title = `${project.name} — NAVICORE`;
  const ogTitle = `${project.name} | Najmul Hasan — NAVICORE`;
  const description = project.tagline;
  const url = `https://najmulhasan.navicore.co/projects/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: "Najmul Hasan",
      title: ogTitle,
      description,
      images: project.img ? [{ url: project.img, alt: `${project.name} screenshot` }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      site: "@navicoreco",
      creator: "@navicoreco",
      title: ogTitle,
      description,
      images: project.img ? [project.img] : undefined,
    },
  };
}

export function generateStaticParams() {
  return Object.keys(projects).map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = projects[slug];

  const schema = project
    ? {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.name,
        description: project.tagline,
        url: `https://najmulhasan.navicore.co/projects/${slug}`,
        image: project.img ? `https://najmulhasan.navicore.co${project.img}` : undefined,
        creator: {
          "@type": "Person",
          name: "Najmul Hasan",
          url: "https://najmulhasan.navicore.co",
        },
        ...(project.live ? { sameAs: [project.live] } : {}),
      }
    : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <ProjectDetailClient />
    </>
  );
}
