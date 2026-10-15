// Usage: npm run new -- "Title of the article"
import fs from "node:fs";
import path from "node:path";

const title = process.argv.slice(2).join(" ").trim();
if (!title) { console.error('Usage: npm run new -- "Title of the article"'); process.exit(1); }

const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 70);
const file = path.join("content", "articles", `${slug}.md`);
if (fs.existsSync(file)) { console.error(`Already exists: ${file}`); process.exit(1); }

const today = new Date().toISOString().slice(0, 10);
const tpl = fs.readFileSync(path.join("templates", "article.md"), "utf8")
  .replace("{{TITLE}}", title.replace(/"/g, '\\"'))
  .replace("{{DATE}}", today);
fs.writeFileSync(file, tpl);
console.log(`Created ${file}  (draft: true — flip to false to publish)`);
