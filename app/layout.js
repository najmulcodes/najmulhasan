import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://najmulhasan.navicore.co"),

  title: {
    default: "Najmul Hasan | Founder & CEO, NAVICORE",
    template: "%s | Najmul Hasan",
  },

  description:
    "Najmul Hasan is the Founder, CEO & CPO of NAVICORE, building RailMate Bangladesh and Navicore Software from Dhaka, Bangladesh.",

  keywords: [
    "Najmul Hasan",
    "najmulcodes",
    "NAVICORE",
    "RailMate Bangladesh",
    "Navicore Software",
    "Founder",
    "CEO",
    "Najmul Hasan Software Engineer",
    "Najmul Hasan Navicore",
    "Navicore Bangladesh",
    "Technology Entrepreneur Bangladesh",
    "Full Stack Developer",
    "Software Engineer Bangladesh",
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
    title: "Najmul Hasan | Founder & CEO, NAVICORE",
    description:
      "Founder, CEO & CPO of NAVICORE, building RailMate Bangladesh and Navicore Software from Dhaka, Bangladesh.",
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
    title: "Najmul Hasan | Founder & CEO, NAVICORE",
    description:
      "Founder, CEO & CPO of NAVICORE, building RailMate Bangladesh and Navicore Software from Dhaka, Bangladesh.",
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
      // TODO: no dedicated square headshot exists yet — using the OG
      // banner image as a stand-in. Add a proper /profile.png (square,
      // 400x400+) to /public and point this back at it.
      image: "https://najmulhasan.navicore.co/preview.png",
      jobTitle: "Founder, CEO & Chief Product Officer",
      worksFor: {
        "@type": "Organization",
        name: "NAVICORE",
        url: "https://navicore.co",
      },
      sameAs: [
        "https://github.com/najmulcodes",
        "https://www.linkedin.com/in/najmulcodes",
        "https://orcid.org/0009-0001-4704-7768",
        "https://najmulcodes.medium.com",
        "https://hashnode.com/@najmulhasan",
        "https://navicore.co",
        "https://profile.navicore.co",
        "https://railmatebd.com",
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
      <head>
        {/* Font Awesome — used site-wide via fab/fas classes (Navbar,
            Contact, venture cards). Previously injected client-side via
            useEffect in page.js, which caused a flash of unstyled icons
            on every load; now server-rendered here instead. */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          referrerPolicy="no-referrer"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
        />
      </head>
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
