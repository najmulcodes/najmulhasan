import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://najmul-portfolio-six.vercel.app"),

  title: {
    default: "Najmul Hasan | Full-Stack Developer",
    template: "%s | Najmul Hasan",
  },

  description:
    "Portfolio of Najmul Hasan — Full-Stack Developer specialising in React, Next.js, Node.js and MongoDB. Building structured and scalable web applications.",

  keywords: [
    "Najmul Hasan",
    "Full Stack Developer",
    "MERN Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "MongoDB",
    "Web Developer Portfolio",
    "Bangladesh Developer",
  ],

  authors: [{ name: "Najmul Hasan" }],
  creator: "Najmul Hasan",

  openGraph: {
    title: "Najmul Hasan | Full-Stack Developer",
    description:
      "Full-Stack Developer specialising in React, Next.js, Node.js and MongoDB.",
    url: "https://najmul-portfolio-six.vercel.app",
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="app-body">
        {children}
      </body>
    </html>
  );
}