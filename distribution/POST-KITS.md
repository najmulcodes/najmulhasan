# Post kits — copy/paste per article

`npm run crosspost` writes dev.to-ready files to `crosspost/devto/` (canonical already set). Hashnode: paste `crosspost/plain/<slug>.md`, then set the original article URL in its settings. Medium: use Import a story with the article URL (Medium sets the canonical to the source).

LinkedIn rule: body has no link; put `https://najmulhasan.navicore.co/blog/<slug>` in the first comment.

---

## 1. nextjs-rate-limiting-upstash-redis-serverless
**dev.to tags:** nextjs, redis, security, serverless
**Hashnode tags:** Next.js, Redis, Security, Serverless, TypeScript

**LinkedIn**
> Your Next.js rate limiter probably does nothing in production.
>
> If it keeps counters in a Map, every serverless instance has its own copy — the attacker's next request lands on a fresh one.
>
> I wrote up the pattern I use: Upstash sliding windows, keys the attacker can't rotate (IP for forms, email for code checks), proper 429 + Retry-After, and the arithmetic behind "5 attempts per 10 minutes" for 6-digit codes: unlimited, 100 guesses/sec covers 36% of the code space in an hour; limited, it's 30 guesses (0.003%).
>
> Code included. Link in the first comment.
>
> #nextjs #serverless #webdev

**Reddit (r/nextjs) title:** `Why in-memory rate limiting silently fails on Vercel, and the Upstash pattern I use instead`

---

## 2. supabase-email-otp-nextjs-6-digit-code
**dev.to tags:** supabase, nextjs, authentication, typescript
**Hashnode tags:** Supabase, Next.js, Authentication, TypeScript

**LinkedIn**
> Magic links broke our mobile sign-in: the email link opened the website instead of the app.
>
> Switching to a 6-digit email code removed the deep-link problem entirely. In the article: the one template change people miss ({{ .Token }}), send/verify route handlers with Supabase SSR cookies, same response for every send request (no account enumeration), and a per-email verify limit.
>
> Link in the first comment.
>
> #supabase #nextjs #authentication

**Reddit (r/Supabase or r/nextjs) title:** `Supabase email OTP in Next.js: 6-digit codes instead of magic links (full route handlers)`

---

## 3. supabase-postgres-rpc-shared-nextjs-react-native
**dev.to tags:** supabase, postgres, reactnative, nextjs
**Hashnode tags:** Supabase, PostgreSQL, React Native, Next.js

**LinkedIn**
> Our website and mobile app slowly disagreed about what a "train" was.
>
> The fix wasn't more discipline — it was moving the search rule into one Postgres function and making both clients call it with generated types. Drift becomes a compile error.
>
> Includes the schema, the SQL function, and the identical RPC call in React Native and Next.js.
>
> Link in the first comment.
>
> #postgres #supabase #reactnative

**Reddit (r/reactnative) title:** `Sharing one Supabase RPC between a Next.js site and a React Native app (stops schema drift)`

---

## 4. llm-github-profile-scorer-nextjs-serverless
**dev.to tags:** ai, nextjs, openai, typescript
**Hashnode tags:** AI, Next.js, OpenAI, TypeScript

**LinkedIn**
> I built a tool that scores a GitHub profile with an LLM. The interesting part isn't the model — it's what I refused to give it.
>
> Anything computable (streaks, language mix, presence checks) is plain code. The model only judges what rules can't (is this README useful?). Its output must pass a schema, and a deterministic fallback runs when it doesn't.
>
> I also list what it can't do: private repos, run-to-run variance, no validation study yet.
>
> Link in the first comment.
>
> #ai #nextjs #typescript

**Hacker News (only with live demo up):** `Show HN: Devfolio Analyzer – score a GitHub profile (deterministic metrics + LLM)`

---

## 5. railmate-compliance-first-data-architecture
**dev.to tags:** reactnative, supabase, architecture, bangladesh
**Hashnode tags:** React Native, Supabase, Architecture, Bangladesh

**LinkedIn**
> Building a Bangladesh Railway app taught me that the hard part isn't the code — it's the data.
>
> RailMate only uses sources I can name and defend, tags every record with a confidence level and verification date, and shows "times not yet verified" instead of guessing. Rider reports are aggregated before any client can read them.
>
> I also describe the gap I found in my own data (125 of 133 trains had no stop times) and how I labelled the recovery honestly.
>
> Link in the first comment.
>
> #bangladesh #reactnative #supabase

**Where:** Bangladeshi dev Facebook groups; Indie Hackers (build-in-public).

---

## 6. expo-react-native-beta-audit-bugs-dev-client-hides
**dev.to tags:** reactnative, expo, testing, mobile
**Hashnode tags:** React Native, Expo, Testing, Mobile

**LinkedIn**
> My own audit said my app wasn't ready for beta. Good.
>
> Six ordinary bugs the dev client never showed me: fonts that never loaded, a menu link to a screen that didn't exist, a filter tab that was always empty, a score drawn on the wrong scale, language settings unreachable after onboarding, and a dead file in the bundle.
>
> The article has the fix for each, plus the one CI check (typed routes + tsc) that catches the dead-link class automatically.
>
> Link in the first comment.
>
> #reactnative #expo #mobiledev

**Reddit (r/reactnative) title:** `Pre-beta audit of my Expo app: 6 bugs the dev client hid (with fixes)`
