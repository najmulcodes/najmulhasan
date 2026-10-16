---
title: 'GitHub Contents API CMS in Next.js: Publish Markdown Without a Database'
seoTitle: GitHub Contents API CMS in Next.js
description: >-
  Use the GitHub Contents API as a CMS in Next.js 16: commit Markdown from a
  browser admin, handle the sha rule and 409 conflicts, with no database to run.
date: '2026-10-16'
tags:
  - nextjs
  - github-api
  - cms
  - markdown
  - typescript
  - vercel
  - app-router
keyword: github contents api cms
draft: true
bnTitle: 'Next.js-এ GitHub Contents API দিয়ে CMS: database ছাড়াই'
bnSummary: >-
  আমার ব্লগে কোনো database নেই।


  Admin panel থেকে একটা Markdown ফাইল সরাসরি GitHub-এ commit হয়, তারপর Vercel
  সাইট redeploy করে। কাজটা হয় একটা call-এই: PUT
  /repos/{owner}/{repo}/contents/{path}।


  ফাইল update করতে তার বর্তমান sha লাগে। 409 এলে বুঝবেন মাঝখানে অন্য কেউ ফাইলটা
  বদলেছে। তখন চুপচাপ retry না করে সেটা দেখাতে হয়।


  Next.js 16-এর পুরো setup লিখেছি। এখন পর্যন্ত যা test করেছি তাও লিখেছি: mock
  server-এর বিপরীতে 41টা API check, live API-তে এখনো চালাইনি।


  লিংক প্রথম কমেন্টে।


  #nextjs #github #webdev #typescript
bnHtml: >-
  <p>মূল ইংরেজি আর্টিকেল: <a
  href="https://najmulhasan.navicore.co/blog/github-contents-api-cms-nextjs">najmulhasan.navicore.co</a></p>

  <p>Database না চালিয়েও browser থেকে লেখা publish করা যায়। Admin form একটা
  Markdown ফাইল GitHub repo-তে commit করে, তারপর host সাইট redeploy করে। এই
  লেখায় Next.js 16-এ GitHub Contents API দিয়ে CMS বানানোর pattern দেখাব, সাথে
  <code>sha</code> নিয়মটা আর 409 error কীভাবে সামলাবেন।</p>

  <p>আগে অবস্থাটা বলে রাখি: এই admin আমি বানিয়েছি, আর mock GitHub, dev.to ও
  IndexNow server-এর বিপরীতে 41টা API check চালিয়েছি। Live service-এর বিপরীতে
  এখনো চালাইনি। তাই নিচের code-কে "mock-এ test করা pattern" ভাববেন, production-এ
  পোড় খাওয়া কিছু নয়।</p>


  <h2>সংক্ষেপে উত্তর</h2>

  <p>একটা request-এই commit হয়:</p>

  <pre><code>PUT /repos/{owner}/{repo}/contents/{path}</code></pre>

  <p>Body-তে দিন <code>message</code>, <code>content</code> (ফাইলের base64) আর
  <code>branch</code>। ফাইল update করলে তার বর্তমান <code>sha</code>-ও দিতে হবে।
  নতুন ফাইলে <code>sha</code> লাগে না। পুরনো <code>sha</code> দিলে 409 আসে। তখন
  চুপচাপ retry না করে editor-কে জানান। Commit হলে Vercel সাইট redeploy করে।</p>

  <p>বাড়তি লাভ: content যেহেতু repo-র ফাইল, প্রতিটা edit-এর git history, diff
  আর rollback এমনিতেই পাবেন।</p>


  <h2>ধাপ ১: GitHub Contents API CMS-এর setup</h2>

  <p>আর্টিকেল থাকে <code>content/articles/&lt;slug&gt;.md</code> ফাইলে। Admin
  একই Next.js app-এর server side-এ চলে, তাই GitHub token কখনো browser-এ যায়
  না।</p>

  <p>Environment variable-এর নাম:</p>

  <pre><code>GITHUB_TOKEN

  GITHUB_OWNER

  GITHUB_REPO

  GITHUB_BRANCH

  SITE_ORIGIN</code></pre>

  <p>শুধু এই একটা repo-র জন্য fine-grained personal access token নিন, Contents
  permission read and write। (অক্টোবর 2026 অনুযায়ী; GitHub settings-এ
  permission-এর নামটা একবার দেখে নিন।) Token-এর আগে কখনো
  <code>NEXT_PUBLIC_</code> বসাবেন না।</p>


  <h2>ধাপ ২: ফাইল পড়া ও লেখা</h2>

  <p>এটা Next.js 16-এর জন্য লেখা একটা minimal version। পুরোটা server-only
  code।</p>

  <pre><code>// lib/github-content.ts

  const OWNER = process.env.GITHUB_OWNER;

  const REPO = process.env.GITHUB_REPO;

  const BRANCH = process.env.GITHUB_BRANCH || "main";

  const base = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;


  function ghHeaders() {
    return {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    };
  }


  export function isValidSlug(slug: unknown) {
    return typeof slug === "string" &amp;&amp; /^[a-z0-9-]{1,80}$/.test(slug);
  }


  export async function readArticle(slug: string) {
    const res = await fetch(
      `${base}/content/articles/${slug}.md?ref=${BRANCH}`,
      { headers: ghHeaders(), cache: "no-store" }
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
    const data = await res.json();
    const markdown = Buffer.from(data.content, "base64").toString("utf8");
    return { markdown, sha: data.sha };
  }


  export async function writeArticle(slug: string, markdown: string, sha?:
  string) {
    const res = await fetch(`${base}/content/articles/${slug}.md`, {
      method: "PUT",
      headers: ghHeaders(),
      body: JSON.stringify({
        message: sha ? `Update article: ${slug}` : `Add article: ${slug}`,
        content: Buffer.from(markdown, "utf8").toString("base64"),
        branch: BRANCH,
        sha,
      }),
    });
    if (res.status === 409) return { conflict: true, sha: null };
    if (!res.ok) throw new Error(`GitHub write failed: ${res.status}`);
    const data = await res.json();
    return { conflict: false, sha: data.content.sha };
  }</code></pre>

  <p><code>sha</code> <code>undefined</code> হলে <code>JSON.stringify</code>
  সেটা বাদ দেয়, তাই একই function create আর update দুটোই করে। Slug path-এ বসানোর
  আগে অবশ্যই validate করুন। ওই regex-ই <code>../</code> ধরনের চালাকি আটকায়।</p>


  <h2>ধাপ ৩: route handler</h2>

  <pre><code>// app/api/admin/articles/route.ts

  import { NextResponse } from "next/server";

  import { cookies } from "next/headers";

  import { verifySession } from "@/lib/session"; // your own signed-cookie
  check, not shown

  import { isValidSlug, writeArticle } from "@/lib/github-content";


  export async function PUT(req: Request) {
    if (req.headers.get("origin") !== process.env.SITE_ORIGIN) {
      return NextResponse.json({ error: "Bad origin" }, { status: 403 });
    }
    const store = await cookies();
    if (!verifySession(store.get("admin_session")?.value)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, markdown, sha } = await req.json();
    if (!isValidSlug(slug) || typeof markdown !== "string" || markdown === "") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    try {
      const result = await writeArticle(slug, markdown, sha);
      if (result.conflict) {
        return NextResponse.json(
          { error: "File changed on GitHub. Reload before saving." },
          { status: 409 }
        );
      }
      return NextResponse.json({ sha: result.sha });
    } catch {
      return NextResponse.json({ error: "Publish failed" }, { status: 502 });
    }
  }</code></pre>

  <p>Next.js 15 থেকে <code>cookies()</code> async, তাই <code>await</code> লাগে।
  এই route-এ dynamic segment নেই। থাকলে <code>params</code>-ও Promise। Next.js
  14-এ দুটোই sync।</p>


  <h2>sha নিয়ম আর 409</h2>

  <p>ফাইল update করতে হলে যে version বদলাচ্ছেন তার blob <code>sha</code> লাগে।
  সেটা পাবেন read request থেকে (<code>GET .../contents/{path}</code>), তারপর
  edit-এর সাথে ফেরত পাঠাতে হয়।</p>

  <ul>

  <li><strong>নতুন sha রেখে দিন।</strong> PUT সফল হলে response-এর
  <code>content.sha</code>-তে নতুন <code>sha</code> আসে। সেটা editor-এর state-এ
  রাখুন। পুরনোটা পাঠাতে থাকলে দ্বিতীয় save fail করবে।</li>

  <li><strong>409 auto-retry করবেন না।</strong> এর মানে ফাইল (বা branch) আপনার
  পড়ার পরে বদলেছে, যেমন অন্য tab থেকে বা সরাসরি commit-এ। নতুন <code>sha</code>
  এনে আবার পাঠালে ওই বদল চুপচাপ মুছে যাবে। 409 editor-কে দেখান, সে reload
  করুক।</li>

  </ul>

  <p>Browser-এর দিকটা:</p>

  <pre><code>const res = await fetch("/api/admin/articles", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, markdown, sha }),
  });

  if (res.status === 409) {
    // tell the editor to reload
  } else if (res.ok) {
    const data = await res.json();
    sha = data.sha; // use this on the next save
  }</code></pre>


  <h2>যা ভুল হতে পারে</h2>

  <ul>

  <li><strong>প্রতিটা save একটা commit, আর প্রতিটা commit একটা deploy trigger
  করতে পারে।</strong> লেখা তৈরি না হওয়া পর্যন্ত front matter-এ <code>draft:
  true</code> রাখুন, আর ঘন ঘন save করবেন না।</li>

  <li><strong>UTF-8 ও base64।</strong> Encode করুন server-এ <code>Buffer</code>
  দিয়ে। Browser-এর <code>btoa</code> Latin-1-এর বাইরের character-এ error দেয়,
  বাংলা লেখাও তার মধ্যে পড়ে।</li>

  <li><strong>একবারে একটা ফাইল লিখুন।</strong> একই branch-এ parallel write
  conflict করতে পারে। GitHub serial request করার পরামর্শ দেয়। (অক্টোবর 2026
  অনুযায়ী; REST docs-এ verify করুন।)</li>

  <li><strong>Branch protection।</strong> Target branch-এ pull request
  বাধ্যতামূলক থাকলে সরাসরি commit reject হবে। যে branch-এ সরাসরি commit চলে
  সেখানে লিখুন।</li>

  <li><strong>বড় ফাইল।</strong> Contents API-র size limit আছে। আর্টিকেল text
  হিসেবে রাখুন, ছবি অন্য জায়গায় রাখুন। (অক্টোবর 2026 অনুযায়ী; বর্তমান limit
  verify করুন।)</li>

  <li><strong>আগে থেকে থাকা ফাইলে <code>sha</code> না দিলে</strong> 409 নয়,
  validation error আসে। (অক্টোবর 2026 অনুযায়ী; ঠিক status code verify
  করুন।)</li>

  <li><strong>Login route-কে সুরক্ষিত রাখুন।</strong> Admin password পার করতে
  পারলে যে কেউ আপনার repo-তে commit করতে পারবে। তার সামনে rate limit বসান: <a
  href="https://najmulhasan.navicore.co/blog/nextjs-rate-limiting-upstash-redis-serverless">Next.js
  rate limiting with Upstash Redis</a> (ইংরেজি)।</li>

  <li><strong>Live-এ test হয়নি।</strong> উপরের সবকিছু শুধু mock server-এর
  বিপরীতে চলেছে। ভরসা করার আগে scratch branch-এ একটা আসল commit করে দেখুন।</li>

  </ul>


  <h2>সারসংক্ষেপ</h2>

  <ul>

  <li>একটা <code>PUT /repos/{owner}/{repo}/contents/{path}</code> call-এ browser
  form একটা commit হয়ে যায়, আর host redeploy করে।</li>

  <li>নতুন ফাইলে <code>sha</code> লাগে না। Update-এ বর্তমান <code>sha</code>
  লাগে, আর প্রতিটা save-এর পর নতুনটা রাখতে হয়।</li>

  <li>409 মানে "অন্য কেউ বদলেছে"। দেখান, চুপচাপ retry করবেন না।</li>

  <li>Token server-এ রাখুন, শুধু একটা repo-র জন্য। Path বানানোর আগে slug
  validate করুন।</li>

  </ul>

  <p>এরপর: Admin বা app-এ password-এর বদলে 6-digit code দিয়ে login চাইলে
  Supabase দিয়ে সেটা কীভাবে হয়: <a
  href="https://najmulhasan.navicore.co/blog/supabase-email-otp-nextjs-6-digit-code">Supabase
  Email OTP in Next.js</a> (ইংরেজি)।</p>

  <p>লেখক: Najmul Hasan, Founder &amp; CEO, NAVICORE। <a
  href="https://najmulhasan.navicore.co">Portfolio</a> · <a
  href="https://najmulhasan.navicore.co/blog">সব আর্টিকেল (English)</a></p>
bnLabels: 'Next.js, GitHub API, CMS, TypeScript'
bnDescription: >-
  Next.js 16-এ GitHub Contents API দিয়ে database ছাড়া browser থেকে Markdown
  commit করার উপায়, sha আর 409 conflict সহ।
bnSlug: github-contents-api-cms-nextjs
---
You can publish from a browser without running a database: an admin form commits a Markdown file to your GitHub repo, and the host redeploys. This post shows that GitHub Contents API CMS pattern in Next.js 16 (App Router), the one rule that trips people up (`sha`), and how to handle a 409.

Status first: I built this admin and ran 41 API checks against mock GitHub, dev.to and IndexNow servers. I have not run it against the live services yet. Treat the code below as a pattern tested against mocks, not a battle-tested one.

## The short answer

Commit with one request:

```
PUT /repos/{owner}/{repo}/contents/{path}
```

Send `message`, `content` (the file, base64-encoded) and `branch`. For an update, also send the file's current `sha`. A new file needs no `sha`. A stale `sha` returns 409. Show that to the editor instead of retrying blindly. After the commit, Vercel redeploys the site.

You also get git history, diffs and rollback for every edit, because the content is just files in the repo.

## Set up the GitHub Contents API as a CMS

Articles are Markdown files in `content/articles/<slug>.md`. The admin runs on the server side of the same Next.js app, so the GitHub token never reaches the browser.

Environment variables (names only):

```
GITHUB_TOKEN
GITHUB_OWNER
GITHUB_REPO
GITHUB_BRANCH
SITE_ORIGIN
```

Use a fine-grained personal access token limited to this one repository, with Contents set to read and write (as of October 2026, verify the permission name in GitHub's settings). Never prefix it with `NEXT_PUBLIC_`.

## Read and write a file

This is a minimal version written for Next.js 16. It is server-only code.

```ts
// lib/github-content.ts
const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || "main";
const base = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;

function ghHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

export function isValidSlug(slug: unknown) {
  return typeof slug === "string" && /^[a-z0-9-]{1,80}$/.test(slug);
}

export async function readArticle(slug: string) {
  const res = await fetch(
    `${base}/content/articles/${slug}.md?ref=${BRANCH}`,
    { headers: ghHeaders(), cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
  const data = await res.json();
  const markdown = Buffer.from(data.content, "base64").toString("utf8");
  return { markdown, sha: data.sha };
}

export async function writeArticle(slug: string, markdown: string, sha?: string) {
  const res = await fetch(`${base}/content/articles/${slug}.md`, {
    method: "PUT",
    headers: ghHeaders(),
    body: JSON.stringify({
      message: sha ? `Update article: ${slug}` : `Add article: ${slug}`,
      content: Buffer.from(markdown, "utf8").toString("base64"),
      branch: BRANCH,
      sha,
    }),
  });
  if (res.status === 409) return { conflict: true, sha: null };
  if (!res.ok) throw new Error(`GitHub write failed: ${res.status}`);
  const data = await res.json();
  return { conflict: false, sha: data.content.sha };
}
```

`JSON.stringify` drops `sha` when it is `undefined`, so one function handles both create and update. Validate the slug before it becomes part of a path. That regex is what stops `../` tricks.

## The route handler

```ts
// app/api/admin/articles/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session"; // your own signed-cookie check, not shown
import { isValidSlug, writeArticle } from "@/lib/github-content";

export async function PUT(req: Request) {
  if (req.headers.get("origin") !== process.env.SITE_ORIGIN) {
    return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  }
  const store = await cookies();
  if (!verifySession(store.get("admin_session")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug, markdown, sha } = await req.json();
  if (!isValidSlug(slug) || typeof markdown !== "string" || markdown === "") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const result = await writeArticle(slug, markdown, sha);
    if (result.conflict) {
      return NextResponse.json(
        { error: "File changed on GitHub. Reload before saving." },
        { status: 409 }
      );
    }
    return NextResponse.json({ sha: result.sha });
  } catch {
    return NextResponse.json({ error: "Publish failed" }, { status: 502 });
  }
}
```

In Next.js 15 and later, `cookies()` is async, hence the `await`. This route has no dynamic segment. If you add one, `params` is a Promise too. Next.js 14 is sync for both.

## The sha rule and the 409

Updating a file needs the blob `sha` of the version you are replacing. Get it from a read (`GET .../contents/{path}`) and send it back with the edit.

Two details cause most bugs:

- **Keep the new sha.** A successful PUT returns the new file `sha` in `content.sha`. Store it in the editor's state. If you keep sending the old one, the second save fails.
- **Do not auto-retry a 409.** It means the file (or the branch) changed since you read it, for example from a second tab or a direct commit. Fetching a fresh `sha` and resending would silently overwrite that change. Return the 409 and let the editor reload.

Browser side:

```ts
const res = await fetch("/api/admin/articles", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ slug, markdown, sha }),
});
if (res.status === 409) {
  // tell the editor to reload
} else if (res.ok) {
  const data = await res.json();
  sha = data.sha; // use this on the next save
}
```

## Pitfalls

- **Every save is a commit, and every commit can trigger a deploy.** Keep `draft: true` in the front matter until the article is ready, and save less often.
- **UTF-8 and base64.** Encode on the server with `Buffer`. In the browser, `btoa` throws on characters outside Latin-1, which includes Bangla text.
- **Write one file at a time.** Parallel writes to the same branch can conflict. GitHub advises serial requests (as of October 2026, verify in the REST docs).
- **Branch protection.** If the target branch requires pull requests, the direct commit is rejected. Commit to a branch that allows it.
- **Large files.** The Contents API has size limits. Keep articles as text and store images elsewhere (as of October 2026, verify the current limits).
- **A missing `sha` on an existing file** is rejected with a validation error, not a 409 (as of October 2026, verify the exact status code).
- **Protect the login route.** Anyone who gets past the admin password can commit to your repo. Put a rate limit in front of it, as in [Next.js rate limiting with Upstash Redis](https://najmulhasan.navicore.co/blog/nextjs-rate-limiting-upstash-redis-serverless).
- **Not tested live.** Everything above passed against mock servers only. Run one real commit to a scratch branch before you rely on it.

## Summary

- One `PUT /repos/{owner}/{repo}/contents/{path}` call turns a browser form into a commit, and the host redeploys.
- New files need no `sha`. Updates need the current `sha`, and you must store the new one after each save.
- Treat 409 as "someone changed this". Show it, do not retry blindly.
- Keep the token server-side and scoped to one repo. Validate the slug before building the path.

Next: if you want a 6-digit code login for an admin or app instead of a password, here is the Supabase version. [Supabase Email OTP in Next.js](https://najmulhasan.navicore.co/blog/supabase-email-otp-nextjs-6-digit-code).
