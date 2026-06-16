# Phase 10 — Performance Improvements

## Goal

Optimize public pages and admin dashboards so Boys of ADV loads faster, handles larger data, and avoids unnecessary database work.

## Scope

Improve performance for:

- Public homepage
- Builds listing/search
- Events listing
- Partners listing
- Admin dashboards
- Admin list pages

---

## 1. Caching Strategy

### Cache homepage stats

Cache totals shown on the homepage, such as:

- approved members count
- published builds count
- active partners count
- upcoming events count

Expected result:

- homepage does not query every count on every request
- stats can refresh periodically or after admin changes

Recommended cache key:

```ts
homepage: stats;
```

---

### Cache featured builds

Cache published featured builds used on the homepage.

Rules:

- only `published` builds
- only `isFeatured = true`
- include owner display name/nickname/codename
- include cover image
- limit result count

Recommended cache key:

```ts
homepage: featured - builds;
```

---

### Cache active partners

Cache partners shown publicly.

Rules:

- only `active` partners
- order by priority or created date
- include logo and external URL

Recommended cache key:

```ts
public: partners: active;
```

---

### Cache upcoming events

Cache events displayed publicly.

Rules:

- only `published` events
- `startsAt >= now`
- order by `startsAt ASC`
- limit result count

Recommended cache key:

```ts
public: events: upcoming;
```

---

### Cache public builds list

Cache default public builds listing.

Rules:

- only `published` builds
- support pagination
- avoid caching highly dynamic personalized data
- search results may use shorter cache duration or no cache if query volume is low

Recommended cache key format:

```ts
public:builds:page:{page}:limit:{limit}
```

---

## 2. Image Optimization

### Optimize build cover images

Requirements:

- use `next/image`
- set proper `sizes`
- provide width/height or fill container with stable aspect ratio
- compress uploads before or during delivery
- avoid loading full-size images in cards
- use blurred or skeleton loading states

---

### Optimize gallery images

Requirements:

- generate thumbnails for grid/list views
- lazy-load non-visible images
- avoid rendering full gallery images immediately
- use modal/lightbox only for full-size image view
- paginate or virtualize large galleries

---

### Optimize event posters

Requirements:

- use responsive image sizes
- prioritize poster only on event detail hero
- lazy-load posters in event cards/lists
- keep poster aspect ratio consistent

---

### Optimize partner logos

Requirements:

- use small optimized logo sizes
- enforce max dimensions
- lazy-load logos below the fold
- avoid layout shift with fixed containers

---

## 3. Query Optimization

### Admin infinite scroll queries

Requirements:

- replace large offset pagination where possible
- use cursor-based pagination
- order by stable indexed fields
- return only columns needed by the table
- avoid loading large text fields in list views
- include total count only when needed

Example cursor fields:

```ts
createdAt;
id;
```

Recommended query shape:

```ts
WHERE created_at < cursorCreatedAt
ORDER BY created_at DESC
LIMIT pageSize
```

---

### Public search queries

Requirements:

- avoid `ILIKE '%query%'` for large datasets
- use Phase 7 full-text search when available
- debounce client search input
- index searchable fields
- limit returned columns
- paginate results
- prevent empty query from running expensive search logic

Recommended behavior:

```txt
empty query      → default cached public list
non-empty query  → full-text search query
```

---

## 4. Cache Invalidation

Invalidate relevant cache when content changes.

### Builds

Invalidate:

```ts
homepage:featured-builds
public:builds:*
homepage:stats
```

When:

- build is published
- build is unpublished
- build is archived
- build featured status changes
- build cover image changes

---

### Partners

Invalidate:

```ts
public: partners: active;
homepage: stats;
```

When:

- partner is created
- partner is updated
- partner status changes
- partner logo changes

---

### Events

Invalidate:

```ts
public: events: upcoming;
homepage: stats;
```

When:

- event is created
- event is updated
- event is cancelled
- event status changes
- event poster changes

---

### Members

Invalidate:

```ts
homepage: stats;
```

When:

- member is approved
- member is suspended
- member is archived

---

## 5. Implementation Requirements

Create reusable cache helpers:

```txt
src/lib/cache/
```

Suggested files:

```txt
src/lib/cache/keys.ts
src/lib/cache/revalidate.ts
src/lib/cache/public-cache.ts
```

Create optimized query functions inside feature modules:

```txt
src/features/builds/queries.ts
src/features/events/queries.ts
src/features/partners/queries.ts
src/features/dashboard/queries.ts
```

---

## 6. Acceptance Criteria

Phase 10 is complete when:

- homepage stats are cached
- featured builds are cached
- active partners are cached
- upcoming events are cached
- public builds default list is cached
- public search uses optimized indexed queries
- admin tables use paginated or cursor-based queries
- public images use `next/image`
- card/list images do not load full-size assets unnecessarily
- cache invalidation runs after content changes
- no admin dashboard loads unnecessary columns
- list pages remain fast with large datasets
