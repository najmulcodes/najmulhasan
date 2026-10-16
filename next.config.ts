import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        // Article renamed to a shorter slug. permanent: true sends a 308.
        source: "/blog/github-contents-api-cms-in-next-js-publish-markdown-without-a-database",
        destination: "/blog/github-contents-api-cms-nextjs",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
