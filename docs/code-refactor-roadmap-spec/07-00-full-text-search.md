# Phase 7 — Full Text Search

## Goal

Replace slow and weak `ILIKE '%query%'` searches with PostgreSQL full text search using `tsvector` and `GIN` indexes.

Start with **Builds**, then expand the same pattern to **Members**, **Events**, and **Partners**.

---

## Scope

### 1. Builds Search

Add full text search for:

- build title
- motorcycle model
- description
- engine setup
- CVT setup
- suspension setup
- braking setup
- wheel setup
- accessories
- owner name
- owner nickname
- owner codename

---

## Database Requirements

### Add Search Vector

Add a generated or maintained `search_vector` column for builds.

```ts
searchVector: tsvector("search_vector");
```

The vector should combine build fields and owner fields.

Example weighting:

- **A**: title, motorcycle model
- **B**: owner name, nickname, codename
- **C**: engine, CVT, suspension, braking, wheel setup
- **D**: description, accessories

---

## Index Requirements

Add a GIN index:

```sql
CREATE INDEX builds_search_vector_idx
ON builds
USING GIN (search_vector);
```

---

## Query Requirements

Replace:

```sql
ILIKE '%query%'
```

with:

```sql
search_vector @@ websearch_to_tsquery('english', query)
```

Use ranking for better results:

```sql
ts_rank(search_vector, websearch_to_tsquery('english', query)) AS rank
```

Sort results by:

1. rank descending
2. featured builds first
3. newest builds first

---

## Implementation Requirements

### Builds

Create a reusable search helper:

```ts
searchBuilds({
  query,
  status,
  limit,
  offset,
});
```

Rules:

- Empty query should return normal listing.
- Non-empty query should use full text search.
- Only public builds should appear on public pages.
- Admin search can include non-public statuses.
- Search should support pagination.
- Search should not duplicate query logic across routes.

---

## Expansion Plan

After Builds is stable, apply the same pattern to:

### Members

Search:

- name
- nickname
- codename
- email
- unit
- chapter

### Events

Search:

- title
- description
- location

### Partners

Search:

- name
- category
- description
- website
- contact email

Each entity should have:

- `search_vector`
- GIN index
- reusable search helper
- updated API/search logic

---

## Acceptance Criteria

- `ILIKE '%query%'` is removed from Builds search.
- Builds search uses PostgreSQL full text search.
- Builds search supports owner name, nickname, and codename.
- Search results are ranked by relevance.
- GIN index exists for Builds search.
- Empty search still works as normal listing.
- Search remains paginated.
- Members, Events, and Partners have a clear follow-up implementation path.
