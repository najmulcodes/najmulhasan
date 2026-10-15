---
title: "Building an LLM-Powered GitHub Profile Scorer: Deterministic Metrics First, Model Second"
seoTitle: "LLM GitHub Profile Analyzer with Next.js"
description: "How I built a serverless GitHub profile analyzer with Next.js and an LLM: weighted scoring, schema-validated JSON output, a deterministic fallback, caching and honest limits."
date: "2026-10-26"
tags: ["ai", "nextjs", "openai", "typescript"]
keyword: "github profile analyzer llm"
draft: true
---

A GitHub profile is a pile of unstructured signals: repositories, READMEs, commit rhythm, a bio. Reviewers skim it for a few minutes and form an opinion that varies by reviewer and by day. I built Devfolio Analyzer to turn that skim into a structured, weighted evaluation. This article walks through the design: what the code computes itself, what it hands to an LLM, how the output is validated, and where the approach stops being trustworthy.

## The short answer

Compute everything that can be computed (language percentages, streaks, presence checks) in plain code. Use the model only for judgments that don't reduce to rules, such as "is this README useful?". Force the model's output through a schema, and keep a deterministic fallback for when it fails.

## The pipeline

1. Validate the username (1–39 alphanumeric characters or hyphens).
2. Fetch in parallel: user profile, repository list, recent events, contribution data.
3. Normalise into a compact object: top repositories, language percentages, contribution metrics, presentation flags.
4. Score with the model against a fixed rubric.
5. Combine into a weighted total, cache it, store a shareable report.

The project's own docs estimate four to eight seconds end to end, dominated by GitHub calls and model latency. I cache results for six hours, which also keeps repeat requests from burning GitHub quota and model spend.

## Reduce the data before the model sees it

Sending raw API responses to a model is slow, expensive and noisy. I rank repositories by a weighted mix of stars (0.4), forks (0.3) and recency (0.3, decaying over 365 days) and keep the top six. Language breakdowns are fetched only for those six to limit API calls. Everything the model receives is a small, predictable JSON object.

Stars are a weak quality signal on their own, so this ranking can prefer a popular repo over a better one. I kept it because it's explainable, and I list it as a limitation rather than pretending otherwise.

## Five dimensions, explicit weights

```ts
// lib/score.ts
import { z } from "zod";

export const WEIGHTS = {
  projectQuality: 0.3,
  consistency: 0.25,
  techStack: 0.2,
  presentation: 0.15,
  community: 0.1,
} as const;

export type Dimension = keyof typeof WEIGHTS;

const Dim = z.object({ score: z.number().min(0).max(100), feedback: z.string().min(1) });

export const LlmResult = z.object({
  projectQuality: Dim,
  consistency: Dim,
  techStack: Dim,
  presentation: Dim,
  community: Dim,
});

export function composite(r: Record<Dimension, { score: number }>): number {
  return Math.round(
    (Object.keys(WEIGHTS) as Dimension[]).reduce((sum, k) => sum + r[k].score * WEIGHTS[k], 0),
  );
}

export function label(total: number): "Excellent" | "Good" | "Fair" | "Weak" | "Poor" {
  if (total >= 85) return "Excellent";
  if (total >= 70) return "Good";
  if (total >= 50) return "Fair";
  if (total >= 30) return "Weak";
  return "Poor";
}
```

The weights sum to 1.0, so the composite stays on the same 0–100 scale as each dimension. Putting them in one constant means the UI, the prompt and the tests all read the same numbers.

## Call the model like an API, not a chatbot

```ts
import OpenAI from "openai";

const client = new OpenAI();

async function callModel(profile: NormalizedProfile): Promise<unknown> {
  const res = await client.chat.completions.create({
    model: process.env.LLM_MODEL ?? "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify(profile) },
    ],
  });
  return JSON.parse(res.choices[0]?.message?.content ?? "{}");
}
```

The system prompt does three jobs: define each dimension, demand JSON only, and forbid generic advice by requiring the model to name specific repositories. It also says explicitly not to reward repository count, so a few maintained projects can outscore many abandoned ones.

## Validate, then fall back

```ts
export async function scoreProfile(profile: NormalizedProfile) {
  try {
    const parsed = LlmResult.safeParse(await callModel(profile));
    if (parsed.success) return { source: "llm" as const, dimensions: parsed.data };
  } catch {
    // timeout or upstream error: fall through to the deterministic path
  }
  return { source: "fallback" as const, dimensions: deterministicScores(profile) };
}
```

`deterministicScores` uses only the computed metrics and returns no model-written feedback. A degraded answer with a clear `source` flag beats a 500 error, and it makes the failure visible in your logs.

## Rate limit before you spend money

Anonymous callers get 5 requests per hour per IP; API-key holders get 60. The limiter runs before any GitHub or model call. The implementation is in [this Upstash guide](https://najmulhasan.navicore.co/blog/nextjs-rate-limiting-upstash-redis-serverless). Also verify the request body with a schema first, so malformed requests never consume quota.

## What this does not do

- **It can't see private repositories**, so developers who work mostly in private are under-represented.
- **Scores vary run to run.** At temperature 0.2 the same profile can move by a few points after the cache expires. Lower temperature reduces variance but doesn't remove it.
- **Test detection is pattern matching.** A file at the right path counts as tests whether or not it tests anything.
- **The contribution calendar isn't in GitHub's public API** for arbitrary users, so I read it from the public profile page, which is fragile when the markup changes.
- **No validation study exists.** I have not compared the scores against independent human reviewers, so treat the output as a structured prompt for a conversation, not a verdict.

## Summary

- Deterministic metrics first; the model only for qualitative judgment.
- Weights in one constant, output validated by schema, fallback path for failures.
- Cache and rate-limit to control GitHub quota and model cost.
- Publish the limits; they're what make the score interpretable.
