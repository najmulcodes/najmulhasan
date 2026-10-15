# Plan — rank "Najmul Hasan", then the keywords

Home of everything: **https://najmulhasan.navicore.co/blog**. Your Person schema, name-in-domain and existing sameAs links already live there, so articles on that host strengthen the one entity Google needs to connect. Company/product keywords go on navicore.co / railmatebd.com.

## 0. Fix first (30 min)

1. **One profile host.** Subdomains `about.`, `profile.`, `najmulcodes.` and `najmulhasan.` on navicore.co: if more than one serves your profile, 301-redirect the others to `najmulhasan.navicore.co` (Vercel → Domains → Redirect). Competing duplicates split ranking for your own name.
2. **One Navicore Software host.** `software.navicore.co` vs `navicoresoftware.com`: pick one, 301 the other.
3. **Square headshot.** `layout.js` still points Person.image at the banner (your own TODO). Add `/public/profile.png` (≥400×400, face centred) and set it. This drives image results and any knowledge panel.
4. **Search Console:** add a **Domain property** for `navicore.co` (one DNS TXT record covers every subdomain). Submit `https://najmulhasan.navicore.co/sitemap.xml`. Request indexing for `/`, `/blog` and each new article.
5. **Name spelling** identical everywhere: "Najmul Hasan". LinkedIn (`/in/najmulcodes`), Hashnode, Medium, ORCID and GitHub already appear in your sameAs; make each profile's website field point to `https://najmulhasan.navicore.co`.

## 1. Weekly loop (Mon → Fri)

| Day | Action |
|---|---|
| Mon | Set `draft: false`, deploy, Request indexing |
| Tue | `npm run crosspost` → **Hashnode** (set original URL), **dev.to** (canonical is in the file), **Medium** (Import a story = auto canonical) |
| Wed | **LinkedIn** native post; link in the first comment |
| Thu | One community post (r/nextjs, r/reactnative, Bangladeshi dev groups; Show HN only for Devfolio's live demo) |
| Fri | Search Console → Performance: impressions, position, queries |

Schedule: 2 live now (rate limiting, email OTP), then Oct 19, Oct 26, Nov 2, Nov 9. Post kits per article are in `POST-KITS.md`.

## 2. Blogger (najmulcodes.blogspot.com)

Worth keeping only for **Bangla** content. Problems in the settings you pasted:

- **robots.txt Sitemap line points to another blog** (`shariarx6t9.blogspot.com`). Replace it with `Sitemap: https://najmulcodes.blogspot.com/sitemap.xml`.
- **Search description is a keyword list.** Use a sentence under 150 characters, e.g. `Bangla and English articles on technology, AI and programming. বাংলা ও ইংরেজিতে প্রযুক্তি, এআই ও প্রোগ্রামিং নিয়ে লেখা।`
- **Author shows "Shariar Ahmed".** Posts carry that Blogger profile name. To build *Najmul Hasan*, publish from a profile with that name or skip Blogger.
- **Delete the two untitled 2015 drafts.**
- Blogger cannot point a canonical at another site, so **never paste the English articles there**. Write a 3–5 paragraph Bangla summary per article that links to the English original; a different language is not duplicate content and the link is a real backlink.

## 3. Expectations

- Name query: weeks, once the host consolidation, indexing and profile links are in place; depends on how common the name is.
- Keyword rankings: 2–6 months, some never. No one can promise page 1.
- Don't buy links or use backlink-automation tools.

## 4. About the crt.sh output

`502` is a crt.sh server error, not "no subdomains", so those empty files mean nothing. `naviocre.com.bd` is a typo. For your own domains the DNS panel and Vercel's Domains tab are authoritative and faster.
