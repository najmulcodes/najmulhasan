# Admin panel: write, publish and distribute from `/admin`

Includes the blog patch. Unzip over the repo root (`unzip -o najmulhasan-blog-admin-patch.zip`), then install deps from BLOG-SETUP.md.
No new npm packages are needed for the admin itself. Works on Next 14 and Next 16.

## 1. Vercel → Settings → Environment Variables (then redeploy)

| Variable | Value |
|---|---|
| `ADMIN_PASSWORD` | 16+ random chars: `openssl rand -base64 24` |
| `ADMIN_SESSION_SECRET` | 32+ random chars: `openssl rand -base64 48` |
| `GITHUB_TOKEN` | Fine-grained token: GitHub → Settings → Developer settings → Fine-grained tokens → **only this repo** → Repository permissions → **Contents: Read and write** |
| `GITHUB_REPO` | `owner/name` of the portfolio repo |
| `GITHUB_BRANCH` | `main` (the branch Vercel deploys) |
| `DEVTO_API_KEY` | optional: dev.to → Settings → Extensions → API keys |
| `INDEXNOW_KEY` | optional: any 8–128 chars `[a-zA-Z0-9-]`, e.g. `openssl rand -hex 16` (served at `/indexnow-key.txt` automatically) |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | optional but recommended: throttles login to 5 tries / 10 min / IP |
| `SITE_URL`, `GSC_PROPERTY` | optional; defaults `https://najmulhasan.navicore.co` and `sc-domain:navicore.co` |

Local use: same variables in `.env.local`. Saving from localhost still commits to GitHub and triggers a deploy.

## 2. Daily flow (all in the browser)

1. `/admin` → log in → **New article** → fill fields (the checklist on the right scores SEO) → **Preview**.
2. **Save draft** (hidden on the site) or **Publish** (sets `draft: false`). Each save = one commit = one Vercel deploy, about 1–2 min.
3. After Publish the **Distribute** tab opens:
   1. Deploy: waits until the page is live.
   2. Google: copies the URL and opens Search Console. Click *Request indexing* (Google has no API for this).
   3. Bing / Yandex: one-click IndexNow.
   4. dev.to: creates a draft (or publishes) with the canonical URL set; remembers it so no duplicates.
   5. Hashnode: copy title/markdown/original URL (its API is paid since 13 May 2026).
   6. Medium: copies the URL and opens the import page (no API for new accounts).
   7. LinkedIn: edit the text, copy it, open the composer, put the link in the first comment.

## 3. Security

- Single password, constant-time compare, 12 h signed `HttpOnly` + `SameSite=Strict` (+ `Secure` in production) cookie.
- State-changing calls also check `Origin` and require `application/json`.
- The GitHub token never reaches the browser; the token can only write contents of one repo.
- `/admin` is `noindex`. Slugs, tags, dates and sizes are validated server-side.
- Preview HTML comes from the same renderer as the site and drops raw HTML.
