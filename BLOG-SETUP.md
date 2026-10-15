# Apply to najmulhasan-main

```bash
# from the repo root: unzip over it (overwrites app/layout.js, app/sitemap.ts, components/Navbar.jsx; see CHANGES.diff)
unzip -o ../najmulhasan-blog-patch.zip

npm i gray-matter highlight.js unified remark-parse remark-gfm remark-rehype rehype-slug rehype-autolink-headings rehype-highlight rehype-stringify
npm pkg set scripts.new="node scripts/new.mjs" scripts.crosspost="node scripts/crosspost.mjs"

npm run dev      # /blog (drafts visible in dev)
npm run build    # drafts excluded in production
```

New article: `npm run new -- "Title"` → edit → set `draft: false`.
Front matter: `title`, `seoTitle` (≤45 chars, becomes the `<title>`), `description` (140–160 chars), `date`, `tags`, `keyword`, `draft`.
Edit identity once in `lib/blog-config.ts`.
