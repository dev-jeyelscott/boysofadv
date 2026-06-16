# Phase 11 — Documentation

## Goal

Make Boys of ADV easier to understand, maintain, onboard, and debug.

---

## Scope

Create a dedicated documentation folder:

```txt
docs/
  architecture.md
  database.md
  permissions.md
  event-bus.md
  notifications.md
  attendance.md
  deployment.md
  cron-jobs.md
  adr/
    001-use-clerk-auth.md
    002-use-drizzle-postgres.md
    003-use-uploadthing.md
    004-use-web-push.md
    005-use-modular-monolith.md
```

---

# Required Documentation

## 1. `docs/architecture.md`

Document the overall system design.

Must include:

- Project purpose
- Tech stack
- Folder structure
- Public website architecture
- Member portal architecture
- Admin panel architecture
- API route conventions
- Domain service boundaries
- Event bus usage
- High-level request flow

Example sections:

```md
# Architecture

## Overview

## Tech Stack

## Application Structure

## Public Pages

## Member Portal

## Admin Panel

## API Routes

## Domain Services

## Event Bus

## Request Flow
```

---

## 2. `docs/database.md`

Document the database schema and important relationships.

Must include:

- Main tables
- Purpose of each table
- Important columns
- Relationships
- Indexes
- Constraints
- Delete behavior
- Search strategy

Cover at minimum:

- `users`
- `builds`
- `gallery_images`
- `events`
- `event_attendance`
- `partners`
- `push_subscriptions`
- `audit_logs`
- `cron_runs`

---

## 3. `docs/permissions.md`

Document roles, statuses, and access rules.

Must include:

- Roles:
  - `super_admin`
  - `admin`
  - `member`

- Member statuses:
  - `for_approval`
  - `approved`
  - `rejected`
  - `suspended`

- Build statuses
- Event statuses
- Admin-only actions
- Member-only actions
- Public access rules
- Permission helper usage

Example matrix:

```md
| Action             | Public | Member | Admin | Super Admin |
| ------------------ | -----: | -----: | ----: | ----------: |
| View public builds |    Yes |    Yes |   Yes |         Yes |
| Submit build       |     No |    Yes |   Yes |         Yes |
| Publish build      |     No |     No |   Yes |         Yes |
| Approve member     |     No |     No |   Yes |         Yes |
| Promote admin      |     No |     No |    No |         Yes |
```

---

## 4. `docs/event-bus.md`

Document the internal event bus pattern.

Must include:

- Why the event bus exists
- Event naming convention
- Event payload convention
- Registered handlers
- Error handling strategy
- Transaction boundary rules
- Current events

Required events:

```ts
"member.approved";
"build.submitted";
"build.published";
"build.rejected";
"event.created";
"event.updated";
"event.cancelled";
"attendance.checked_in";
```

---

## 5. `docs/notifications.md`

Document push notification behavior.

Must include:

- Web Push overview
- VAPID config
- Subscription storage
- Subscribe endpoint
- Unsubscribe endpoint
- Status endpoint
- Notification triggers
- Admin notifications
- Member notifications
- Cleanup behavior for expired subscriptions

Triggers to document:

- Build published
- Event created
- Event updated
- Build liked
- Pending approval digest
- Event reminders
- Build review reminders

---

## 6. `docs/attendance.md`

Document event attendance and QR check-in.

Must include:

- QR check-in flow
- Rotating token behavior
- Geofence validation
- GPS accuracy handling
- Attendance table behavior
- Duplicate check-in rule
- Valid event status rules
- Time window rules
- Admin attendance summary

---

## 7. `docs/deployment.md`

Document production deployment.

Must include:

- Vercel deployment process
- Required environment variables
- PostgreSQL setup
- Clerk setup
- UploadThing setup
- Web Push setup
- Cron secret setup
- Migration process
- Seed process
- Production safety checklist

---

## 8. `docs/cron-jobs.md`

Document scheduled jobs.

Must include:

- Cron endpoint
- Schedule
- Purpose
- Required auth header
- Expected result
- Failure handling
- Related database fields

Cover:

- Event status automation
- Upcoming event reminders
- Pending approval digest
- Build review reminder
- Event attendance summary
- Inactive member detection
- Build popularity calculation
- Expired push subscription cleanup
- Database cleanup
- Orphan file cleanup

Example table:

```md
| Job                 | Endpoint                    | Schedule       | Purpose                             |
| ------------------- | --------------------------- | -------------- | ----------------------------------- |
| Event Status Update | `/api/cron/update-status`   | `*/30 * * * *` | Updates event display/status logic  |
| Event Reminders     | `/api/cron/event-reminders` | `0 7 * * *`    | Sends upcoming event push reminders |
```

---

# ADR Requirements

Each ADR should follow this format:

```md
# ADR 001: Use Clerk Auth

## Status

Accepted

## Context

## Decision

## Consequences

## Alternatives Considered
```

---

## Required ADRs

### `001-use-clerk-auth.md`

Document why Clerk is used for authentication.

Cover:

- Hosted auth
- User lifecycle webhooks
- Faster implementation
- Role/status stored internally
- Tradeoff: external dependency

---

### `002-use-drizzle-postgres.md`

Document why Drizzle + PostgreSQL is used.

Cover:

- Type-safe SQL
- Relational data fit
- Strong indexing
- Full-text search support
- Migrations
- Tradeoff: more schema discipline required

---

### `003-use-uploadthing.md`

Document why UploadThing is used.

Cover:

- Image uploads
- Build covers
- Gallery images
- Event posters
- Partner logos
- Tradeoff: orphan cleanup required

---

### `004-use-web-push.md`

Document why Web Push is used.

Cover:

- Member/admin alerts
- Browser-native push
- Event reminders
- Build notifications
- Tradeoff: subscription expiration and browser permission friction

---

### `005-use-modular-monolith.md`

Document why the project uses a modular monolith.

Cover:

- Simple deployment
- Clear feature modules
- Easier refactoring
- Shared database
- Avoids microservice overhead
- Tradeoff: module boundaries require discipline

---

# Acceptance Criteria

Phase 11 is complete when:

- `docs/` folder exists.
- All required markdown files exist.
- Every major project area has a maintenance document.
- ADR folder exists.
- All 5 ADRs are written.
- Documentation reflects the current Boys of ADV architecture.
- Cron jobs and environment variables are documented.
- Permission rules are clear enough for future development.
- New developers can understand the project without reading the whole codebase first.
