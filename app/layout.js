import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://najmulhasan.navicore.co"),

  title: {
    default: "Najmul Hasan | Full-Stack Developer",
    template: "%s | Najmul Hasan",
  },

  description:
    "Portfolio of Najmul Hasan — Full-Stack Developer specialising in React, Next.js, Node.js and MongoDB. Building structured and scalable web applications.",

  keywords: [
    "Najmul Hasan",
    "najmulcodes",
    "Full Stack Developer",
    "MERN Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "MongoDB",
    "Web Developer Portfolio",
    "Bangladesh Developer",
  ],

  authors: [{ name: "Najmul Hasan", url: "https://najmulhasan.navicore.co" }],
  creator: "Najmul Hasan",

  openGraph: {
    title: "Najmul Hasan | Full-Stack Developer",
    description:
      "Full-Stack Developer specialising in React, Next.js, Node.js and MongoDB.",
    url: "https://najmulhasan.navicore.co",
    siteName: "Najmul Hasan Portfolio",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Najmul Hasan Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Najmul Hasan | Full-Stack Developer",
    description:
      "Full-Stack Developer specialising in React, Next.js, Node.js and MongoDB.",
    images: ["/preview.png"],
  },

  icons: {
    icon: "/icon.png",
  },
};

// Person + WebSite structured data — this is what lets Google merge
// your GitHub, LinkedIn, and this site into one confirmed entity
// instead of treating them as unrelated pages.
const personSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Najmul Hasan",
      alternateName: "najmulcodes",
      url: "https://najmulhasan.navicore.co",
      image: "https://najmulhasan.navicore.co/profile.png",
      jobTitle: "Full-Stack Software Engineer",
      worksFor: {
        "@type": "Organization",
        name: "Navicore Software",
        url: "https://software.navicore.co",
      },
      sameAs: [
        "https://github.com/najmulcodes",
        "https://www.linkedin.com/in/najmulcodes",
      ],
      knowsAbout: [
        "React",
        "Next.js",
        "Node.js",
        "MongoDB",
        "Express",
        "JavaScript",
        "REST API",
        "JWT Authentication",
      ],
    },
    {
      "@type": "WebSite",
      name: "Najmul Hasan Portfolio",
      url: "https://najmulhasan.navicore.co",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="app-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
