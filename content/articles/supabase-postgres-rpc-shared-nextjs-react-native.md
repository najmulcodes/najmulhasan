---
title: "One Postgres Function for Web and Mobile: Sharing Search Logic Between Next.js and React Native"
seoTitle: "Shared Supabase RPC: Next.js + React Native"
description: "Stop schema drift between your website and mobile app. Put search logic in one Supabase Postgres RPC function and call it from Next.js and React Native with generated types."
date: "2026-10-19"
tags: ["supabase", "postgres", "reactnative", "nextjs"]
keyword: "supabase rpc react native next.js"
draft: true
---

Two clients, one database, and eventually two different ideas of what a "train" is. That is what happened in RailMate: the website queried one schema shape, the mobile app queried another, and the website's version was still tied to an external API the project had decided not to depend on. The fix was to put search logic in a single Postgres function and make both clients call it. This guide shows the pattern with Supabase RPC, React Native and Next.js.

## The short answer

Write the query once as a Postgres function, expose it with `supabase.rpc()`, generate TypeScript types from the database, and import the same types in both apps. Anything the clients disagree on becomes a compile error instead of a production bug.

## Why drift happens

Each client grows its own query code: a `.from("trains").select(...)` chain in the app, a different one on the web. Then a column is renamed or a business rule changes (which days a train runs, which stops count), and one client is updated. Nothing fails loudly; results just differ.

## Design the schema for the query, not the UI

A simplified version:

```sql
create table stations (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

create table trains (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  days_of_week smallint[] not null  -- days the train RUNS, ISO numbering: 1 = Mon ... 7 = Sun
);

create table train_stops (
  train_id uuid references trains(id) on delete cascade,
  station_id uuid references stations(id),
  stop_order int not null,
  arrival_time time,
  departure_time time,
  primary key (train_id, stop_order)
);

create index on train_stops (station_id, train_id);
```

Two decisions worth copying. First, UUID primary keys everywhere, so ids from one environment can't collide with another's. Second, `days_of_week` stores the days a train runs (an inclusion list) rather than the days it doesn't. Off-day lists invert silently when someone misreads them; an inclusion list reads the way the query uses it.

## The function

```sql
create or replace function public.search_trains(
  p_from uuid,
  p_to   uuid,
  p_date date
)
returns table (
  train_id   uuid,
  train_name text,
  departs    time,
  arrives    time
)
language sql
stable
security invoker
set search_path = public
as $$
  select t.id, t.name, a.departure_time, b.arrival_time
  from trains t
  join train_stops a on a.train_id = t.id and a.station_id = p_from
  join train_stops b on b.train_id = t.id and b.station_id = p_to
  where a.stop_order < b.stop_order
    and extract(isodow from p_date)::smallint = any (t.days_of_week)
  order by a.departure_time;
$$;
```

The `a.stop_order < b.stop_order` condition makes sure the train visits the origin before the destination. `security invoker` means row-level security policies apply to the caller, which is what you want for a function exposed to clients.

Test it in the SQL editor before touching either app:

```sql
select * from search_trains('<from-uuid>', '<to-uuid>', '2026-10-20');
```

## Generate types once, share them

```bash
npx supabase gen types typescript --project-id "$SUPABASE_PROJECT_REF" > packages/db/database.types.ts
```

Put the file in a shared package (or copy it into both repos in your CI step). Both clients then create a typed client:

```ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/db/database.types";

export const supabase = createClient<Database>(url, anonKey);
```

## Call it from both clients

The call is identical in React Native and Next.js:

```ts
export async function searchTrains(from: string, to: string, date: string) {
  const { data, error } = await supabase.rpc("search_trains", {
    p_from: from,
    p_to: to,
    p_date: date, // "YYYY-MM-DD"
  });
  if (error) throw error;
  return data; // typed: { train_id, train_name, departs, arrives }[]
}
```

In the mobile app wrap it in TanStack Query for caching and retries; on the web call it from a Server Component or route handler. The function is the single source of truth; the wrappers are thin.

## Pitfalls

- **ISO day numbering.** `extract(isodow ...)` returns 1–7 with Monday = 1. `extract(dow ...)` returns 0–6 with Sunday = 0. Pick one and document it next to the column.
- **Changing return columns.** Postgres can't `create or replace` a function if the return type changes. Drop and recreate in a migration, and ship a client update together.
- **Don't expose raw crowd data.** If part of your result comes from user-submitted reports, join against an aggregated view rather than the raw reports table, so neither client can read individual submissions.
- **Missing data is not zero.** If a train has no verified stop times, return nothing for those fields instead of guessing; let the UI say "not yet verified".

## Summary

- One RPC function owns the business rule; both clients call it.
- Generated types turn drift into compile errors.
- Store inclusion lists, use UUIDs, and index the join columns.
