---
title: 'Supabase Email OTP in Next.js: 6-Digit Codes Instead of Magic Links'
seoTitle: Supabase Email OTP in Next.js (6-Digit Code)
description: >-
  Implement Supabase email OTP in Next.js with 6-digit codes: template change,
  send and verify route handlers, SSR cookies, brute-force limits and
  enumeration-safe responses.
date: '2026-10-14'
updated: '2026-10-16'
tags:
  - supabase
  - nextjs
  - authentication
  - typescript
keyword: supabase email otp nextjs
draft: false
syndication:
  devto: >-
    https://dev.to/najmulcodes/supabase-email-otp-in-nextjs-6-digit-codes-instead-of-magic-links-2ioc
---
Magic links are the default in Supabase email sign-in, and they break in exactly the places you don't test: in-app browsers, email clients that pre-fetch links, and mobile apps where the link opens your website instead of your app. In RailMate, an email sign-in link opening the website instead of the mobile app was one of the open issues in a pre-beta checklist. A 6-digit code avoids deep links entirely: the user reads it in their mail app and types it where they started. Here is how to implement Supabase email OTP in Next.js.

## The short answer

Change the email template to print `{{ .Token }}`, call `signInWithOtp` to send the code, then call `verifyOtp` with `type: "email"` to create the session. Rate-limit verification per email address.

## 1. Change the email template

In the Supabase dashboard go to **Authentication → Email Templates → Magic Link** and replace the link with the token:

```html
<h2>Your sign-in code</h2>
<p>Enter this code to continue:</p>
<p style="font-size:28px;letter-spacing:6px"><strong>{{ .Token }}</strong></p>
<p>It expires soon. If you didn't request it, ignore this email.</p>
```

If the template still contains `{{ .ConfirmationURL }}`, users receive a link and the code flow looks broken. Also configure custom SMTP (Resend, Postmark, SES). The default sender is intended for testing and is heavily rate-limited.

## 2. A server client that handles cookies

```ts
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(list) {
          try {
            list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component; middleware refreshes the session instead.
          }
        },
      },
    },
  );
}
```

## 3. Send the code

```ts
// app/api/auth/send-otp/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { clientIp, limiters } from "@/lib/rate-limit";

const Body = z.object({ email: z.string().email().max(254) });

export async function POST(req: Request) {
  const ip = await limiters.otpSend.limit(clientIp(req));
  if (!ip.success) return NextResponse.json({ error: { code: "RATE_LIMIT_EXCEEDED" } }, { status: 429 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: { code: "INVALID_EMAIL" } }, { status: 400 });

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email.toLowerCase(),
    options: { shouldCreateUser: true },
  });
  if (error) console.error("send-otp", error.message);

  // Same response whether or not the email exists or sending failed: no account enumeration.
  return NextResponse.json({ ok: true });
}
```

## 4. Verify the code

```ts
// app/api/auth/verify-otp/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { limiters } from "@/lib/rate-limit";

const Body = z.object({
  email: z.string().email().max(254),
  token: z.string().regex(/^\d{6}$/),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: { code: "INVALID_CODE" } }, { status: 400 });

  const email = parsed.data.email.toLowerCase();
  const rl = await limiters.otpVerify.limit(email); // keyed by email, not IP
  if (!rl.success) return NextResponse.json({ error: { code: "RATE_LIMIT_EXCEEDED" } }, { status: 429 });

  const supabase = createClient();
  const { error } = await supabase.auth.verifyOtp({ email, token: parsed.data.token, type: "email" });
  if (error) return NextResponse.json({ error: { code: "INVALID_CODE" } }, { status: 401 });

  return NextResponse.json({ ok: true }); // session cookies were set by the server client
}
```

Key the verify limiter on the email. An attacker can rotate IPs for free but can't change the account they're targeting. The limiter implementation and the numbers are in the [Upstash rate limiting guide](https://najmulhasan.navicore.co/blog/nextjs-rate-limiting-upstash-redis-serverless).

## 5. Keep the session fresh with middleware

```ts
// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(list) {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );
  await supabase.auth.getUser(); // refreshes the token if needed
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
```

## Pitfalls

- **Users get a link, not a code.** The template still contains `{{ .ConfirmationURL }}`.
- **Account enumeration.** Returning "no such user" from the send endpoint lets anyone test which emails are registered. Always return `{ ok: true }`.
- **Unlimited guesses.** A 6-digit code has 1,000,000 values; without a verify limit a fast script covers a large share of them within the code's lifetime. Five attempts per 10 minutes per email caps it at 30 guesses an hour.
- **Trusting the client.** Use `getUser()` on the server for authorization decisions, not the session object read from cookies.
- **Phone OTP is a separate problem.** SMS providers have their own restrictions; for instance, trial tiers can limit delivery to verified numbers, which blocks real users in testing and launch.

## Summary

- Template `{{ .Token }}` → `signInWithOtp` → `verifyOtp({ type: "email" })`.
- Same response for every send request; rate-limit by IP on send and by email on verify.
- Run middleware so sessions refresh, and authorize with `getUser()`.
