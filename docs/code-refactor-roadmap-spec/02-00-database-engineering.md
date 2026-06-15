# Database Engineering

## Goal

Improve database performance, search quality, and query observability for Boys of ADV by adding proper indexes, learning query analysis with `EXPLAIN ANALYZE`, and upgrading search from basic `ILIKE '%query%'` to PostgreSQL full-text search.

---

## 1. Scope

This spec covers database performance work for these searchable/admin-heavy entities:

- `users`
- `builds`
- `events`
- `push_subscriptions`
- future searchable entities such as:
  - `partners`
  - `gallery_images`
  - `event_attendance`
  - `contact_messages`
  - `partner_inquiries`

---

## 2. Current Problem

The project currently relies on simple filters and text search patterns like:

```sql
WHERE title ILIKE '%query%'
```

This works for small datasets, but it becomes slow as records grow because PostgreSQL often cannot use normal B-tree indexes for leading-wildcard searches.

Problems:

- Admin tables may become slow.
- Public build search may degrade.
- Event listings may scan too many rows.
- Member search may become expensive.
- No formal query measurement process exists yet.

---

## 3. Target Outcome

After this phase:

- Common filters use indexes.
- Admin tables load predictably.
- Public search is faster and more relevant.
- Developers can read `EXPLAIN ANALYZE`.
- Search uses `tsvector`, `tsquery`, and `GIN` indexes.
- Performance decisions are measured, not guessed.

---

## 4. Indexing Requirements

### 4.1 Users Indexes

#### Use Cases

- Login/account lookup by email.
- Admin filtering by status.
- Member approval queue.
- Search members by name, nickname, codename, email.

#### Required Indexes

```sql
CREATE INDEX users_email_idx ON users (email);
CREATE INDEX users_status_idx ON users (status);
CREATE INDEX users_role_idx ON users (role);
CREATE INDEX users_created_at_idx ON users (created_at);
```

#### Recommended Composite Indexes

```sql
CREATE INDEX users_status_created_at_idx ON users (status, created_at DESC);
CREATE INDEX users_role_status_idx ON users (role, status);
```

Use this for admin lists like:

```sql
WHERE status = 'for_approval'
ORDER BY created_at DESC
```

---

### 4.2 Builds Indexes

#### Use Cases

- Public builds listing.
- Admin build review queue.
- Owner-specific build lookup.
- Status filtering.
- Featured/published builds.
- Search by title, model, setup fields.

#### Required Indexes

```sql
CREATE INDEX builds_status_idx ON builds (status);
CREATE INDEX builds_user_id_idx ON builds (user_id);
CREATE INDEX builds_created_at_idx ON builds (created_at);
CREATE INDEX builds_updated_at_idx ON builds (updated_at);
```

#### Recommended Composite Indexes

```sql
CREATE INDEX builds_status_created_at_idx ON builds (status, created_at DESC);
CREATE INDEX builds_user_id_status_idx ON builds (user_id, status);
```

Useful for:

```sql
WHERE status = 'published'
ORDER BY created_at DESC
```

and:

```sql
WHERE user_id = $1 AND status = 'published'
```

---

### 4.3 Events Indexes

#### Use Cases

- Public event listing.
- Upcoming events.
- Admin event table.
- Event status automation.
- Reminder cron jobs.
- Attendance summary cron jobs.

#### Required Indexes

```sql
CREATE INDEX events_status_idx ON events (status);
CREATE INDEX events_start_date_idx ON events (start_date);
CREATE INDEX events_end_date_idx ON events (end_date);
CREATE INDEX events_created_at_idx ON events (created_at);
```

#### Recommended Composite Indexes

```sql
CREATE INDEX events_status_start_date_idx ON events (status, start_date);
CREATE INDEX events_status_end_date_idx ON events (status, end_date);
```

Useful for:

```sql
WHERE status = 'published'
AND start_date >= now()
ORDER BY start_date ASC
```

and:

```sql
WHERE status = 'published'
AND end_date < now()
```

---

### 4.4 Push Subscriptions Indexes

#### Use Cases

- Send push notification to one user.
- Remove expired subscriptions.
- Unsubscribe user device.
- Avoid duplicate subscriptions.

#### Required Indexes

```sql
CREATE INDEX push_subscriptions_user_id_idx
ON push_subscriptions (user_id);

CREATE INDEX push_subscriptions_created_at_idx
ON push_subscriptions (created_at);
```

#### Recommended Unique Index

```sql
CREATE UNIQUE INDEX push_subscriptions_endpoint_unique_idx
ON push_subscriptions (endpoint);
```

This prevents duplicate browser/device subscriptions.

---

## 5. Drizzle Schema Requirements

Indexes should be declared inside Drizzle schema where possible.

Example:

```ts
import {
  index,
  uniqueIndex,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    status: text("status").notNull(),
    role: text("role").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
    statusIdx: index("users_status_idx").on(table.status),
    roleIdx: index("users_role_idx").on(table.role),
    statusCreatedAtIdx: index("users_status_created_at_idx").on(
      table.status,
      table.createdAt,
    ),
  }),
);
```

---

## 6. Query Analysis Requirements

### 6.1 Required Command

Developers must test important queries using:

```sql
EXPLAIN ANALYZE
```

For more detail:

```sql
EXPLAIN (ANALYZE, BUFFERS)
```

---

### 6.2 Queries to Analyze

#### Builds Search

Test:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM builds
WHERE status = 'published'
ORDER BY created_at DESC
LIMIT 20;
```

Also test search queries before and after full-text search.

---

#### Events Listing

Test:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM events
WHERE status = 'published'
AND start_date >= now()
ORDER BY start_date ASC
LIMIT 20;
```

---

#### Admin Tables

Test:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM users
WHERE status = 'for_approval'
ORDER BY created_at DESC
LIMIT 50;
```

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM builds
WHERE status = 'for_review'
ORDER BY created_at DESC
LIMIT 50;
```

---

## 7. Metrics to Record

For every important query, record:

| Metric         | Meaning                                             |
| -------------- | --------------------------------------------------- |
| Scan type      | `Seq Scan`, `Index Scan`, `Bitmap Index Scan`, etc. |
| Execution time | Actual query duration                               |
| Planning time  | Time spent planning the query                       |
| Rows scanned   | How many rows PostgreSQL inspected                  |
| Rows returned  | Final result count                                  |
| Index usage    | Whether the intended index was used                 |
| Buffers        | Useful for checking disk/memory read behavior       |

---

## 8. Full-Text Search Requirements

### 8.1 Why Replace `ILIKE`

Current approach:

```sql
WHERE title ILIKE '%query%'
```

Problems:

- Slow on large tables.
- Poor relevance ranking.
- Hard to search multiple columns cleanly.
- Usually causes sequential scans.

Target approach:

```sql
tsvector @@ plainto_tsquery('english', $query)
```

---

## 9. Full-Text Search Targets

### 9.1 Builds Search

Search fields:

- `title`
- `model`
- `description`
- `engine`
- `cvt`
- `suspension`
- `braking`
- `wheel`
- `accessories`

#### Migration SQL

```sql
ALTER TABLE builds
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(model, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(engine, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(cvt, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(suspension, '')), 'C') ||
  setweight(to_tsvector('english', coalesce(braking, '')), 'C') ||
  setweight(to_tsvector('english', coalesce(wheel, '')), 'C') ||
  setweight(to_tsvector('english', coalesce(accessories, '')), 'D')
) STORED;

CREATE INDEX builds_search_vector_idx
ON builds
USING GIN (search_vector);
```

#### Query

```sql
SELECT *,
  ts_rank(search_vector, plainto_tsquery('english', $1)) AS rank
FROM builds
WHERE status = 'published'
AND search_vector @@ plainto_tsquery('english', $1)
ORDER BY rank DESC, created_at DESC
LIMIT 20;
```

---

### 9.2 Members Search

Search fields:

- `name`
- `nickname`
- `codename`
- `email`
- `unit`
- `chapter`

#### Migration SQL

```sql
ALTER TABLE users
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('simple', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(nickname, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(codename, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(email, '')), 'B') ||
  setweight(to_tsvector('simple', coalesce(unit, '')), 'C') ||
  setweight(to_tsvector('simple', coalesce(chapter, '')), 'C')
) STORED;

CREATE INDEX users_search_vector_idx
ON users
USING GIN (search_vector);
```

Use `simple` config for names, nicknames, codenames, and emails because English stemming is not always useful for proper nouns.

#### Query

```sql
SELECT *,
  ts_rank(search_vector, plainto_tsquery('simple', $1)) AS rank
FROM users
WHERE status = 'approved'
AND search_vector @@ plainto_tsquery('simple', $1)
ORDER BY rank DESC, created_at DESC
LIMIT 50;
```

---

### 9.3 Events Search

Search fields:

- `title`
- `description`
- `location`

#### Migration SQL

```sql
ALTER TABLE events
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(location, '')), 'C')
) STORED;

CREATE INDEX events_search_vector_idx
ON events
USING GIN (search_vector);
```

#### Query

```sql
SELECT *,
  ts_rank(search_vector, plainto_tsquery('english', $1)) AS rank
FROM events
WHERE status = 'published'
AND search_vector @@ plainto_tsquery('english', $1)
ORDER BY rank DESC, start_date ASC
LIMIT 20;
```

---

## 10. Implementation Plan

### Phase 1 — Add Basic Indexes

#### Tasks

- Add indexes to Drizzle schema.
- Generate migration.
- Apply migration locally.
- Apply migration to staging/preview database.
- Verify app still works.

#### Deliverables

- Updated Drizzle schema.
- Migration file.
- Index list documentation.

---

### Phase 2 — Analyze Current Queries

#### Tasks

Run `EXPLAIN (ANALYZE, BUFFERS)` on:

- builds public listing
- builds admin listing
- events listing
- users admin table
- pending approvals
- push subscription queries

#### Deliverables

Create this file:

```txt
docs/database/query-analysis.md
```

With this format:

````md
### Query: Published Builds Listing

#### SQL

```sql
SELECT ...
```
````

#### Before Indexing

- Scan type:
- Execution time:
- Rows scanned:
- Rows returned:
- Index used:

#### After Indexing

- Scan type:
- Execution time:
- Rows scanned:
- Rows returned:
- Index used:

#### Notes

...

````

---

### Phase 3 — Add Full-Text Search

#### Tasks

- Add `search_vector` to `builds`.
- Add `search_vector` to `users`.
- Add `search_vector` to `events`.
- Add GIN indexes.
- Replace `ILIKE` search logic.
- Add ranking with `ts_rank`.
- Keep fallback behavior when query is empty.

#### Deliverables

- Migration file.
- Updated search queries.
- Search helper functions.
- Updated public and admin search.

---

### Phase 4 — Add Search Utilities

Create:

```txt
src/lib/db/search.ts
````

Example responsibilities:

```ts
export function normalizeSearchQuery(query: string) {
  return query.trim().replace(/\s+/g, " ");
}

export function hasSearchQuery(query?: string | null) {
  return Boolean(query && normalizeSearchQuery(query).length >= 2);
}
```

---

## 11. Acceptance Criteria

This phase is complete when:

- `users`, `builds`, `events`, and `push_subscriptions` have proper indexes.
- Common admin queries no longer rely on unnecessary sequential scans.
- Build search uses `tsvector`.
- Member search uses `tsvector`.
- Event search uses `tsvector`.
- `EXPLAIN ANALYZE` results are documented.
- Empty search queries still return normal paginated listings.
- Search results are ranked.
- Queries remain compatible with Drizzle and PostgreSQL.

---

## 12. Suggested File Changes

```txt
src/db/schema.ts
src/lib/db/search.ts
src/features/builds/queries.ts
src/features/events/queries.ts
src/features/members/queries.ts
docs/database/query-analysis.md
drizzle/migrations/*
```

---

## 13. Engineering Notes

Use indexes intentionally. Do not index every column by default.

Good index candidates:

- Columns used in `WHERE`
- Columns used in `JOIN`
- Columns used in `ORDER BY`
- Foreign keys
- Frequently filtered enum/status columns

Avoid unnecessary indexes because they:

- slow down inserts
- slow down updates
- increase storage usage
- make migrations heavier

---

## 14. Priority

Recommended order:

1. `builds(status, created_at)`
2. `events(status, start_date)`
3. `users(status, created_at)`
4. `push_subscriptions(user_id)`
5. full-text search for `builds`
6. full-text search for `users`
7. full-text search for `events`
