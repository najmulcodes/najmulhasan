---
title: >-
  Rate Limiting Next.js API Routes with Upstash Redis (and Why In-Memory Fails
  on Serverless)
seoTitle: Next.js Rate Limiting with Upstash Redis
description: >-
  A production pattern for Next.js rate limiting on Vercel: Upstash sliding
  windows, per-IP and per-email keys, correct 429 headers, and the in-memory
  trap.
date: '2026-10-14'
tags:
  - nextjs
  - redis
  - security
  - serverless
keyword: next.js rate limiting
draft: false
syndication:
  devto: >-
    https://dev.to/najmulcodes/rate-limiting-nextjs-api-routes-with-upstash-redis-and-why-in-memory-fails-on-serverless-4jom
---
Every public endpoint you ship — a contact form, a newsletter signup, an OTP sender — will be hit by bots within days. Next.js rate limiting is the cheapest defence, but the version most tutorials show does nothing once you deploy to serverless. This article covers the pattern I use in production on Vercel with Upstash Redis, the numbers behind my limits, and the failure mode to avoid.

## The short answer

Store counters in Redis, not in your function's memory. Use `@upstash/ratelimit` with a sliding window, key it by whatever the attacker cannot rotate (IP for anonymous forms, email for code verification), and return `429` with `Retry-After`.

## Why an in-memory Map fails on serverless

This looks correct and works on your laptop:

```ts
// Does nothing useful in production.
const hits = new Map<string, number[]>();

export function allow(ip: string, max = 5, windowMs = 600_000) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length <= max;
}
```

On serverless platforms such as Vercel, requests can be served by different function instances, instances are created and destroyed on demand, and none of them share memory. Your counter lives in one instance; the attacker's next request will often land on another with an empty counter. The limiter never trips.

You need state that outlives and spans instances. Redis is the standard answer, and Upstash's HTTP-based client works in serverless and edge runtimes without connection pooling headaches.

## Setup

```bash
npm i @upstash/ratelimit @upstash/redis
```

Create a database in the Upstash console and add the REST credentials to your environment:

```bash
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

## One helper, several limiters

```ts
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

if (process.env.NODE_ENV === "production" && !process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error("UPSTASH_REDIS_REST_URL is required in production");
}

const redis = Redis.fromEnv();

export const limiters = {
  contact:   new Ratelimit({ redis, prefix: "rl:contact",    limiter: Ratelimit.slidingWindow(5, "10 m") }),
  otpSend:   new Ratelimit({ redis, prefix: "rl:otp-send",   limiter: Ratelimit.slidingWindow(3, "10 m") }),
  otpVerify: new Ratelimit({ redis, prefix: "rl:otp-verify", limiter: Ratelimit.slidingWindow(5, "10 m") }),
};

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
```

The `prefix` keeps each limiter's keys separate, so a noisy contact form can't burn an OTP user's budget. On Vercel the platform sets `x-forwarded-for`; if you sit behind other proxies, make sure only your trusted proxy can set that header or the key is spoofable.

## Use it in a route handler

```ts
// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { clientIp, limiters } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const { success, limit, remaining, reset } = await limiters.contact.limit(clientIp(req));

  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.ceil(reset / 1000)),
  };

  if (!success) {
    const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
    return NextResponse.json(
      { error: { code: "RATE_LIMIT_EXCEEDED", message: "Too many requests. Try again later." } },
      { status: 429, headers: { ...headers, "Retry-After": String(retryAfter) } },
    );
  }

  // validate body, send the email...
  return NextResponse.json({ ok: true }, { headers });
}
```

Run the limiter **before** validation and any paid call (email, LLM, database write). Rejected requests should cost you almost nothing.

## Pick the key the attacker can't rotate

| Endpoint | Key | Reason |
|---|---|---|
| Contact form | IP | No identity exists yet |
| OTP send | IP, plus email | IP stops one attacker; email stops mailbox flooding from many IPs |
| OTP verify | Email | An attacker can rotate IPs but cannot change the victim's email |

## The arithmetic behind "5 attempts per 10 minutes"

A 6-digit code has 1,000,000 possibilities. With no limit, an attacker making a hypothetical 100 guesses per second tries 360,000 codes in an hour — 36% of the space. With five verify attempts per 10 minutes, the same attacker gets 30 guesses an hour: 30 in 1,000,000, or 0.003%. Check your auth provider's code lifetime and size the window against it.

## Fail open or fail closed?

If Redis is unreachable, `limit()` throws. Decide per endpoint:

```ts
try {
  const res = await limiters.otpVerify.limit(email.toLowerCase());
  if (!res.success) return tooMany(res);
} catch (err) {
  console.error("rate limiter unavailable", err);
  return NextResponse.json({ error: { code: "UPSTREAM_ERROR" } }, { status: 503 }); // auth: fail closed
}
```

For a contact form I fail open and log, because losing a lead is worse than letting a few extra messages through. For authentication endpoints I fail closed.

## Test it

```bash
for i in $(seq 1 7); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST https://your-site.com/api/contact \
    -H "content-type: application/json" -d '{}'
done
```

The first five return whatever your validation returns for an empty body (for example `400`). The sixth and seventh return `429`.

## The in-memory fallback trap

Many projects keep an in-memory fallback "so it still works without Redis." That is fine for local development and harmful in production, because it silently provides no protection. My own website backend ships such a fallback; the guard at the top of `rate-limit.ts` above is how I make a missing credential a deploy error instead of a quiet hole.

## Summary

- In-memory counters don't work across serverless instances; use Redis.
- Use sliding windows, a `prefix` per limiter, and keys the attacker can't rotate.
- Return `429` with `Retry-After`, and run the limiter before expensive work.
- Decide fail-open vs fail-closed deliberately for each endpoint.

Next up: the same limiter protecting a [6-digit email OTP flow with Supabase](https://najmulhasan.navicore.co/blog/supabase-email-otp-nextjs-6-digit-code).
