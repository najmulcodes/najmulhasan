// Usage: npm run crosspost            -> published articles only
//        npm run crosspost -- --all   -> include drafts
// Output: crosspost/devto/<slug>.md  (front matter + canonical_url, paste into dev.to "published: false")
//         crosspost/plain/<slug>.md  (title + body for Hashnode / LinkedIn article editor)
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://najmulhasan.navicore.co").replace(/\/$/, "");
const includeDrafts = process.argv.includes("--all");
const src = path.join("content", "articles");

for (const sub of ["devto", "plain"]) fs.mkdirSync(path.join("crosspost", sub), { recursive: true });

let n = 0;
for (const file of fs.readdirSync(src).filter((f) => f.endsWith(".md"))) {
  const slug = file.replace(/\.md$/, "");
  const { data, content } = matter(fs.readFileSync(path.join(src, file), "utf8"));
  if (data.draft === true && !includeDrafts) continue;

  const canonical = `${SITE}/blog/${slug}`;
  // dev.to tags: max 4, alphanumeric only
  const tags = (data.tags ?? []).map((t) => String(t).toLowerCase().replace(/[^a-z0-9]/g, "")).filter(Boolean).slice(0, 4);
  const footer = `\n\n---\n\n*Originally published at [${canonical.replace(/^https?:\/\//, "")}](${canonical}).*\n`;

  const front = [
    "---",
    `title: ${JSON.stringify(data.title)}`,
    "published: false",
    `description: ${JSON.stringify(data.description)}`,
    `tags: ${tags.join(", ")}`,
    `canonical_url: ${canonical}`,
    "---",
    "",
  ].join("\n");

  fs.writeFileSync(path.join("crosspost", "devto", file), front + content.trim() + footer);
  fs.writeFileSync(path.join("crosspost", "plain", file), `# ${data.title}\n\n${content.trim()}${footer}`);
  n++;
}
console.log(`Wrote ${n} article(s) to ./crosspost`);
