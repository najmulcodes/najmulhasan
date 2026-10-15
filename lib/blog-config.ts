// Single source of truth for the blog. URLs match app/layout.js (hardcoded there too).
export const blog = {
  url: "https://najmulhasan.navicore.co",
  name: "Najmul Hasan",
  tagline: "Field notes on Next.js, Supabase, React Native and shipping products from Bangladesh.",
  // Must equal the "@id" given to the Person node in app/layout.js so Google merges the entity.
  personId: "https://najmulhasan.navicore.co/#person",
  author: {
    name: "Najmul Hasan",
    role: "Founder & CEO, NAVICORE",
    bio: "I build web, mobile and backend products with Next.js, React Native, TypeScript and Supabase, and write up what works (and what broke) along the way.",
  },
  org: { name: "NAVICORE", url: "https://navicore.co" },
} as const;
