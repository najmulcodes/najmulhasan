---
title: "Expo App Audit: 6 Bugs Your Dev Client Won't Show You Before Beta"
seoTitle: "Expo Pre-Beta Audit: 6 Bugs to Check"
description: "A pre-beta audit checklist for Expo and React Native apps, built from real findings: fonts never loaded, dead routes, broken filters, wrong score scales and unreachable settings."
date: "2026-11-09"
tags: ["reactnative", "expo", "testing", "mobile"]
keyword: "expo react native pre-launch checklist"
draft: true
---

Before inviting beta testers I ran a structured audit of RailMate, my React Native/Expo app. The verdict was blunt: not ready for beta. None of the findings were architectural. They were small, ordinary bugs that stay hidden during day-to-day development because you always test the same paths in the same dev client. Here are the six categories, with the fix for each.

## The short answer

Audit a release-like build, not the dev client. Walk every screen and every link, test every filter with real data, and look for the bugs that only appear when you stop knowing where things are.

```bash
eas build --platform android --profile preview
```

## 1. Fonts that never loaded

The app declared custom fonts, including a dedicated Bengali typeface, but nothing ever loaded them. React Native doesn't warn loudly: text just renders in the system font, and the design you think you're shipping isn't the one on screen.

```tsx
// app/_layout.tsx
import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;
  return <Stack />;
}
```

Check: every `fontFamily` string you use must appear in a `useFonts` map.

## 2. A menu item pointing to a screen that doesn't exist

A Profile menu entry linked to a settings route with no file behind it. In Expo Router, routes are files, so a typo or a deleted screen leaves a link that goes nowhere.

Turn on typed routes and let the compiler find these:

```json
// app.json
{ "expo": { "experiments": { "typedRoutes": true } } }
```

Then run `npx tsc --noEmit` in CI. A link to a missing route becomes a type error.

## 3. A filter tab that was always empty

A "verified" tab on the community screen filtered on a condition that no record ever satisfied. Everything looked fine with a few demo rows and nobody tapped that tab with real data.

Fix: for each filter, seed data that should match it and assert the result isn't empty. A test as small as this catches it:

```ts
it("verified filter returns verified reports", () => {
  const items = [{ id: 1, verifiedCount: 3 }, { id: 2, verifiedCount: 0 }];
  expect(filterVerified(items).map((i) => i.id)).toEqual([1]);
});
```

## 4. A score displayed against the wrong scale

The trust score was stored on one range and rendered as if it were on another, so the badge showed misleading progress. Anything a user reads as "good" or "bad" needs one owner of its range:

```ts
export const TRUST_SCORE_MAX = 100;

export const trustPercent = (score: number) =>
  Math.min(100, Math.max(0, (score / TRUST_SCORE_MAX) * 100));
```

Import the constant in both the code that writes the score and the component that draws it.

## 5. A setting that can't be reached after onboarding

Language selection existed only in the first-run flow, so a user who picked the wrong language had no way back. Rule: every choice made during onboarding needs a permanent entry point in Settings, and you should reach it from a fresh install in under three taps.

## 6. Dead code shipped in the bundle

An old mockup file was still in the repo. It's harmless until someone imports it or the file confuses a reviewer. Find unused files with a tool instead of memory:

```bash
npx knip
```

## What happened next

A later checklist counted sixteen issues fixed, with two blockers still open: an email sign-in link opening the website instead of the app, and a phone-number OTP flow blocked by trial-tier SMS restrictions. The first is why I now prefer typed codes over magic links; see [Supabase email OTP in Next.js](https://najmulhasan.navicore.co/blog/supabase-email-otp-nextjs-6-digit-code).

## Summary

- Audit a preview build, not the dev client.
- Fonts: every `fontFamily` must be loaded.
- Routes: typed routes plus `tsc` in CI.
- Filters: test with data that should match.
- Scales: one constant owns each range.
- Settings: every onboarding choice needs a permanent home.
- Dead code: let a tool find it.
