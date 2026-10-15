---
title: "Building RailMate: A Compliance-First Data Architecture for a Bangladesh Railway App"
seoTitle: "Building a Bangladesh Railway App: RailMate"
description: "How RailMate sources Bangladesh Railway data without depending on an undocumented API: permitted sources, confidence-graded records, a PDF pipeline and anonymised crowd reports."
date: "2026-11-02"
tags: ["reactnative", "supabase", "architecture", "bangladesh"]
keyword: "bangladesh railway app"
draft: true
---

If you want to build a train app for Bangladesh, the data is the hard part. Bangladesh Railway publishes timetables as PDFs and runs an official e-ticketing portal built for buying seats, not for third-party software. Community projects fill the gap, many by calling an undocumented API that sits behind the booking portal. RailMate takes a different route, and this article explains the architecture, the tradeoffs, and what it cost.

## The short answer

RailMate treats where data comes from as a design constraint. It uses only sources it can name and defend, attaches a confidence level and a verification date to every schedule record, and limits live signal to anonymised, aggregated rider reports.

## What RailMate is (and isn't)

RailMate is a React Native/Expo app plus a Next.js website, sharing one Supabase Postgres database. It handles train search, route and fare information, and community-reported delays and crowding. It does not sell tickets: purchase hands off to the official portal.

## Three tiers of sources

**Used:** the operator's official website and timetable PDFs (highest trust), a small number of MIT-licensed community repositories (cross-checked against the PDF), and Wikipedia under its attribution licence for things like station coordinates. OpenStreetMap's Nominatim geocoder was used once to seed coordinates, not as a runtime dependency, because its usage policy discourages heavy use.

**Not used in production:** automated calls to the undocumented API behind the booking portal, automated interaction with the portal itself, any proprietary tracking feed that needs a paid agreement, and storing users' railway-account credentials.

I made this a checkable rule, not a statement of intent. After the refactor I searched the whole codebase for references to the retired endpoint and found none outside comments explaining why they were removed.

I'm not a lawyer, and I haven't found a published terms of service for that API, which is exactly the point: when the position is unclear, I'd rather not build the product on it. If the operator ever agrees to a data-sharing arrangement, the schema can take it.

## Every record carries its own honesty

```text
trains.confidence       -- 'high' | 'medium' | 'low'
trains.last_verified    -- date
train_stops.*           -- left empty rather than guessed
```

- If stop times haven't been verified, the UI shows "times not yet verified" instead of an estimate.
- If a record is older than six months, the app says so.
- Records seeded from secondary sources are tagged medium or low, not promoted to "high".

This costs freshness and completeness. It buys a product that can answer "how sure are you?" for every row.

## The PDF pipeline

Timetable PDFs aren't machine-readable, so the import is deliberately manual at the end:

1. Download the official PDF.
2. Extract tables with a PDF table-extraction tool.
3. Convert to the schema with a parsing script.
4. Validate with a script.
5. A human spot-checks a sample of important trains before anything ships.

Slow, but a wrong departure time is worse than a missing one.

## A data gap I had to own

During an audit I found that most trains had no stop-by-stop times. The cause was mundane: the original plan was to fill them from the third-party API, and once I decided not to depend on it, nothing else filled the gap. At one point 125 of 133 trains had no stops. The recovery migration inserted 515 stop rows covering all 133 trains, sourced from existing verified data, secondary sites and Wikipedia, and tagged at medium or lower confidence. It's better than empty, and it's labelled as less reliable than the PDF-verified records.

## Crowd signal without exposing individuals

Riders can report delays, crowding and coach condition. Raw reports live in a table neither client can read. Both the app and website query a single aggregated view, so a person's report is never shown to anyone else; only the summary is. The app receives updates through Supabase Realtime; the website polls the same view.

## One search function for both clients

An earlier version had the website and app using different schemas. I unified them on one UUID-keyed schema and a single Postgres function; the details are in [this article on shared RPC functions](https://najmulhasan.navicore.co/blog/supabase-postgres-rpc-shared-nextjs-react-native).

## What isn't finished

- Remaining medium/low-confidence schedule, off-day and station-code records need independent verification.
- I haven't evaluated whether the community reporting and trust score resist manipulation. No study exists.
- Some mobile beta blockers were still open in the most recent checklist; the audit story is in [this article](https://najmulhasan.navicore.co/blog/expo-react-native-beta-audit-bugs-dev-client-hides).
- The outbound ticket-purchase link needs human confirmation that it points to the current official portal.

## Summary

- Pick sources you can defend, write the rule down, and verify it with a search.
- Store confidence and verification dates on the data itself.
- Aggregate crowd reports before any client can read them.
- Label gaps; don't hide them.
