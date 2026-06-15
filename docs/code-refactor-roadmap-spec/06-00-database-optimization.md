# Phase 6 — Database Optimization

## Goal

Improve query performance, enforce data integrity, and prevent duplicate or orphaned records.

### Scope

Add indexes, unique constraints, foreign key rules, and delete behavior for core Boys of ADV tables.

---

## Required Indexes

### Users

```ts
users.status;
users.role;
users.clerk_user_id;
users.email;
```

Purpose:

- Faster member approval filtering
- Faster admin/member role queries
- Faster Clerk user lookup during auth
- Faster email-based lookup

### Builds

```ts
builds.status;
builds.user_id;
builds.is_featured;
builds.created_at;
```

Purpose:

- Faster build moderation views
- Faster user build lookup
- Faster featured build sections
- Faster recent build sorting

### Events

```ts
events.status;
events.starts_at;
events.ends_at;
```

Purpose:

- Faster public event listing
- Faster upcoming/ongoing/completed event filtering
- Faster cron-based event status checks

### Partners

```ts
partners.status;
partners.category;
```

Purpose:

- Faster partner listing
- Faster category filtering

### Push Subscriptions

```ts
push_subscriptions.user_id;
```

Purpose:

- Faster push notification lookup per user

### Event Attendance

```ts
event_attendance.event_id;
event_attendance.user_id;
```

Purpose:

- Faster attendance lookup by event
- Faster attendance lookup by member

---

## Required Constraints

### Users

```ts
unique(users.clerk_user_id);
unique(users.email);
```

Rules:

- One database user per Clerk account
- One account per email address

### Event Attendance

```ts
unique(event_attendance.event_id, event_attendance.user_id);
```

Rules:

- A member can only check in once per event
- Prevent duplicate attendance rows

---

## Foreign Key Requirements

Required relationships:

```ts
builds.user_id -> users.id
push_subscriptions.user_id -> users.id
event_attendance.user_id -> users.id
event_attendance.event_id -> events.id
```

Optional relationships, if present:

```ts
gallery_images.build_id -> builds.id
gallery_images.event_id -> events.id
```

---

## Delete Rules

### Recommended Cascade Rules

Use cascade when child records should not survive the parent.

```ts
push_subscriptions.user_id -> users.id ON DELETE CASCADE
event_attendance.event_id -> events.id ON DELETE CASCADE
gallery_images.build_id -> builds.id ON DELETE CASCADE
gallery_images.event_id -> events.id ON DELETE CASCADE
```

### Recommended Restrict Rules

Use restrict when deleting the parent would destroy important historical data.

```ts
builds.user_id -> users.id ON DELETE RESTRICT
event_attendance.user_id -> users.id ON DELETE RESTRICT
```

Reason:

- Do not delete users if they still own builds.
- Do not delete users if they have attendance history.
- Prefer suspending or archiving users instead of hard deleting.

---

## Implementation Requirements

- Add indexes through Drizzle schema definitions.
- Generate a database migration.
- Review existing duplicate data before adding unique constraints.
- Backfill or clean invalid records before enforcing constraints.
- Run migration locally before production.
- Validate affected queries with `EXPLAIN ANALYZE`.

---

## Acceptance Criteria

- Indexes exist for all listed columns.
- Clerk user ID is unique.
- User email is unique.
- Event attendance is unique per event and user.
- Required foreign keys are enforced.
- Delete behavior is explicitly defined.
- No orphaned builds, subscriptions, attendance records, or gallery images.
- Existing app flows still work after migration.
