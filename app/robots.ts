import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://najmulhasan.navicore.co/sitemap.xml",
    host: "https://najmulhasan.navicore.co",
  };
}