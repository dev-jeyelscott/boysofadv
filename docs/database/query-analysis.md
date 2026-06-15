# Database Query Analysis

Date: 2026-06-15

This report covers the database engineering phase for `users`, `builds`, `events`, and `push_subscriptions`.

## Review Summary

### db-master

Approved index strategy:

| Table                | Single-column indexes                            | Composite / unique indexes                       | Full-text index        |
| -------------------- | ------------------------------------------------ | ------------------------------------------------ | ---------------------- |
| `users`              | `email`, `status`, `role`, `created_at`          | `(status, created_at DESC)`, `(role, status)`    | GIN on `search_vector` |
| `builds`             | `status`, `user_id`, `created_at`, `updated_at`  | `(status, created_at DESC)`, `(user_id, status)` | GIN on `search_vector` |
| `events`             | `status`, `start_date`, `end_date`, `created_at` | `(status, start_date)`, `(status, end_date)`     | GIN on `search_vector` |
| `push_subscriptions` | `user_id`, `created_at`                          | unique `endpoint`                                | Not applicable         |

Full-text search design:

- `builds.search_vector`: English config, weighted title/model highest, setup fields lower.
- `users.search_vector`: Simple config, weighted names/nickname/codename highest, email next, unit/chapter lower.
- `events.search_vector`: English config, weighted title, description, location.
- Search queries use `plainto_tsquery`, `@@`, `ts_rank`, and rank-first ordering for non-empty search terms.

### system-architect

The design is scalable for the current access patterns because high-cardinality searches move to GIN indexes and common admin filters use targeted B-tree indexes. The long-term maintenance concern is index growth: new searchable entities should not receive full-text columns until their user flows need it. If search evolves into cross-entity global search, consider a dedicated search table or external search service instead of adding large vectors everywhere.

### backend

Implemented:

- Drizzle schema indexes for `users`, `builds`, `events`, and `push_subscriptions`.
- Generated stored `tsvector` columns for `users`, `builds`, and `events`.
- Reusable search utilities in `lib/db/search.ts`.
- Public build search, admin build search, admin member search, membership approval search, and admin event search now use full-text search instead of `ILIKE`.
- Empty or one-character searches fall back to normal filtered listings.
- Existing filters, status constraints, joins, and admin permission checks are preserved.

### sr-engineer

Local measurement note: this machine's Docker Postgres database has only 2 users, 1 build, 0 events, and 0 push subscriptions. PostgreSQL may prefer sequential scans on tiny tables because that is cheaper than index access. Index usability was additionally validated with `enable_seqscan = off` for GIN/vector-only checks.

### devops

Migration safety risks:

- Adding stored generated vectors rewrites/backfills existing rows.
- Creating GIN indexes can be heavier than B-tree indexes on large tables.
- Replacing `push_subscriptions_endpoint_idx` with `push_subscriptions_endpoint_unique_idx` will fail if duplicate endpoints already exist.

Recommended preflight:

```sql
SELECT endpoint, count(*)
FROM push_subscriptions
GROUP BY endpoint
HAVING count(*) > 1;
```

Resolve duplicates before production migration.

## Queries

### Query: Published Builds Listing

#### SQL

```sql
SELECT *
FROM builds
WHERE status = 'published'
ORDER BY created_at DESC
LIMIT 20;
```

#### Before Indexing

- Scan type: Seq Scan + Sort
- Execution time: 0.224 ms
- Planning time: 1.093 ms
- Rows scanned: 1
- Rows returned: 1
- Index used: no
- Buffers: 10 shared hit

#### After Indexing

- Scan type: Seq Scan + Sort on tiny local table
- Execution time: 0.099 ms
- Planning time: 1.061 ms
- Rows scanned: 1
- Rows returned: 1
- Index used: no, planner chose cheaper sequential scan due tiny table
- Buffers: 4 shared hit

#### Notes

The intended index is `builds_status_created_at_idx`. Re-test on staging or production-scale data after `ANALYZE`.

### Query: Upcoming Published Events

#### SQL

```sql
SELECT *
FROM events
WHERE status = 'published'
AND start_date >= now()
ORDER BY start_date ASC
LIMIT 20;
```

#### Before Indexing

- Scan type: Seq Scan + Sort
- Execution time: 0.074 ms
- Planning time: 0.714 ms
- Rows scanned: 0
- Rows returned: 0
- Index used: no
- Buffers: 3 shared hit

#### After Indexing

- Scan type: Index Scan
- Execution time: 0.106 ms
- Planning time: 1.509 ms
- Rows scanned: 0
- Rows returned: 0
- Index used: `events_status_start_date_idx`
- Buffers: 5 shared hit

#### Notes

This confirms the composite event listing index is selected.

### Query: Pending Member Approvals

#### SQL

```sql
SELECT *
FROM users
WHERE status = 'for_approval'
ORDER BY created_at DESC
LIMIT 50;
```

#### Before Indexing

- Scan type: Seq Scan + Sort
- Execution time: 0.161 ms
- Planning time: 0.797 ms
- Rows scanned: 2
- Rows returned: 0
- Index used: no
- Buffers: 4 shared hit

#### After Indexing

- Scan type: Seq Scan + Sort on tiny local table
- Execution time: 1.171 ms
- Planning time: 4.180 ms
- Rows scanned: 2
- Rows returned: 0
- Index used: no, planner chose cheaper sequential scan due tiny table
- Buffers: 4 shared hit

#### Forced Index Validation

- Scan type: Index Scan
- Execution time: 0.205 ms
- Index used: `users_status_created_at_idx`

### Query: Admin Build Review Queue

#### SQL

```sql
SELECT *
FROM builds
WHERE status = 'for_review'
ORDER BY created_at DESC
LIMIT 50;
```

#### Before Indexing

- Scan type: Seq Scan + Sort
- Execution time: 0.051 ms
- Planning time: 0.265 ms
- Rows scanned: 1
- Rows returned: 0
- Index used: no
- Buffers: 10 shared hit

#### After Indexing

- Scan type: Seq Scan + Sort on tiny local table
- Execution time: 0.221 ms
- Planning time: 1.378 ms
- Rows scanned: 1
- Rows returned: 0
- Index used: no, planner chose cheaper sequential scan due tiny table
- Buffers: 4 shared hit

#### Notes

The intended index is `builds_status_created_at_idx`. Re-test with larger data.

### Query: Build Full-Text Search

#### SQL

```sql
SELECT *,
  ts_rank(search_vector, plainto_tsquery('english', 'adv')) AS rank
FROM builds
WHERE status = 'published'
AND search_vector @@ plainto_tsquery('english', 'adv')
ORDER BY rank DESC, created_at DESC
LIMIT 20;
```

#### After Full-Text Search

- Scan type: Seq Scan + Sort on tiny local table
- Execution time: 0.196 ms
- Planning time: 1.876 ms
- Rows scanned: 1
- Rows returned: 1
- Index used: no, planner chose cheaper sequential scan due tiny table
- Buffers: 41 shared hit

#### GIN Validation

- Vector-only forced scan type: Bitmap Index Scan + Bitmap Heap Scan
- Execution time: 0.091 ms
- Index used: `builds_search_vector_idx`

### Query: Member Full-Text Search

#### SQL

```sql
SELECT *,
  ts_rank(search_vector, plainto_tsquery('simple', 'admin')) AS rank
FROM users
WHERE status = 'approved'
AND search_vector @@ plainto_tsquery('simple', 'admin')
ORDER BY rank DESC, created_at DESC
LIMIT 50;
```

#### After Full-Text Search

- Scan type: Seq Scan + Sort on tiny local table
- Execution time: 0.053 ms
- Planning time: 0.615 ms
- Rows scanned: 2
- Rows returned: 0
- Index used: no, planner chose cheaper sequential scan due tiny table
- Buffers: 7 shared hit

#### GIN Validation

- Vector-only forced scan type: Bitmap Index Scan + Bitmap Heap Scan
- Execution time: 0.066 ms
- Index used: `users_search_vector_idx`

### Query: Event Full-Text Search

#### SQL

```sql
SELECT *,
  ts_rank(search_vector, plainto_tsquery('english', 'ride')) AS rank
FROM events
WHERE status = 'published'
AND search_vector @@ plainto_tsquery('english', 'ride')
ORDER BY rank DESC, start_date ASC
LIMIT 20;
```

#### After Full-Text Search

- Scan type: Index Scan using status index + Sort
- Execution time: 0.070 ms
- Planning time: 2.147 ms
- Rows scanned: 0
- Rows returned: 0
- Index used: `events_status_end_date_idx`, planner filtered vector after status index
- Buffers: 8 shared hit

#### GIN Validation

- Vector-only forced scan type: Bitmap Index Scan + Bitmap Heap Scan
- Execution time: 0.038 ms
- Index used: `events_search_vector_idx`

### Query: Push Subscriptions By User

#### SQL

```sql
SELECT *
FROM push_subscriptions
WHERE user_id = 'local-user'
ORDER BY created_at DESC;
```

#### After Indexing

- Scan type: Bitmap Index Scan + Bitmap Heap Scan + Sort
- Execution time: 0.090 ms
- Planning time: 0.526 ms
- Rows scanned: 0
- Rows returned: 0
- Index used: `push_subscriptions_user_id_idx`
- Buffers: 5 shared hit

## Rollback Plan

Drizzle does not generate down migrations in this project. If production rollback is required, deploy code that no longer references `search_vector`, then run:

```sql
DROP INDEX IF EXISTS push_subscriptions_endpoint_unique_idx;
DROP INDEX IF EXISTS push_subscriptions_created_at_idx;
DROP INDEX IF EXISTS push_subscriptions_user_id_idx;
DROP INDEX IF EXISTS events_search_vector_idx;
DROP INDEX IF EXISTS events_status_end_date_idx;
DROP INDEX IF EXISTS events_status_start_date_idx;
DROP INDEX IF EXISTS events_created_at_idx;
DROP INDEX IF EXISTS events_end_date_idx;
DROP INDEX IF EXISTS events_start_date_idx;
DROP INDEX IF EXISTS events_status_idx;
DROP INDEX IF EXISTS builds_search_vector_idx;
DROP INDEX IF EXISTS builds_user_id_status_idx;
DROP INDEX IF EXISTS builds_status_created_at_idx;
DROP INDEX IF EXISTS builds_updated_at_idx;
DROP INDEX IF EXISTS builds_created_at_idx;
DROP INDEX IF EXISTS builds_user_id_idx;
DROP INDEX IF EXISTS builds_status_idx;
DROP INDEX IF EXISTS users_search_vector_idx;
DROP INDEX IF EXISTS users_role_status_idx;
DROP INDEX IF EXISTS users_status_created_at_idx;
DROP INDEX IF EXISTS users_created_at_idx;
DROP INDEX IF EXISTS users_role_idx;
DROP INDEX IF EXISTS users_status_idx;
DROP INDEX IF EXISTS users_email_idx;

ALTER TABLE events DROP COLUMN IF EXISTS search_vector;
ALTER TABLE builds DROP COLUMN IF EXISTS search_vector;
ALTER TABLE users DROP COLUMN IF EXISTS search_vector;

CREATE UNIQUE INDEX IF NOT EXISTS push_subscriptions_endpoint_idx
ON push_subscriptions (endpoint);
```

## Deployment Checklist

- Confirm duplicate push endpoints are removed before migration.
- Run the migration on staging/preview first.
- Run `ANALYZE users; ANALYZE builds; ANALYZE events; ANALYZE push_subscriptions;` after migration.
- Re-run the important `EXPLAIN (ANALYZE, BUFFERS)` queries on staging-sized data.
- Verify public build search, admin build search, admin member search, membership approvals search, and admin event search.
- Verify empty search still returns normal paginated lists.
- Monitor migration duration, lock waits, database CPU, and query latency during deployment.
- Keep rollback SQL available and deploy rollback code before dropping generated columns.

## Recommendations

- Do not infer production latency from the local numbers because the local dataset is too small.
- Re-run this report against staging with representative row counts before production release.
- Consider concurrent index creation for very large production tables in a future migration process, because Drizzle transactional migrations and `CREATE INDEX CONCURRENTLY` need careful handling.
- Add future full-text vectors only when a searchable flow exists and has measurable performance needs.
