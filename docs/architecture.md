# Architecture

## Overview

Boys of ADV is a community platform for Honda ADV riders. It combines a public website, member portal, and admin panel in one Next.js application.

The application is a modular monolith: routes live in the App Router, shared UI lives in `components/`, persistence lives in `db/`, and newer business workflows live in `src/features/` services. Server Actions and API routes stay thin and delegate validation, state transitions, notifications, and audit behavior to services where possible.

## Tech Stack

- Next.js 16 App Router and React 19
- TypeScript
- Tailwind CSS v4 and shadcn/ui
- Clerk authentication
- PostgreSQL with Drizzle ORM
- UploadThing for uploads
- Web Push with VAPID keys
- Vercel hosting and cron jobs
- Vitest and Playwright for tests

## Application Structure

```txt
app/                         App Router pages, layouts, Server Actions, and API routes
app/(protected)/member       Approved member portal
app/(protected)/admin        Admin panel
app/api                      Route handlers for cron, push, UploadThing, webhooks, and event APIs
components/                  Shared UI and client components
db/                          Drizzle connection, schema, migrations, seed/reset scripts
features/                    Older feature-oriented UI/helpers
lib/                         Auth helpers, permissions, push, cron, cache, observability, utilities
src/features/                Domain services, validation, queries, and service types
src/lib/events               Typed domain event bus and handlers
tests/                       Integration and end-to-end tests
```

## Public Pages

Public pages are available without authentication and are optimized for mobile viewing:

- `/` and marketing/community content
- `/about`
- `/builds` and `/builds/[buildId]`
- `/events` and `/events/[eventId]`
- `/partners`
- `/be-a-partner`
- `/sign-in` and `/sign-up`

Public visitors can read published builds, events, and partner listings. Mutations such as build comments, likes, push subscription updates, and event check-in require an authenticated approved member.

## Member Portal

The member portal lives under `app/(protected)/member`. It is protected by Clerk and project-level member status checks. Approved members can maintain their profile and build profile. Users that are authenticated but not approved are redirected to `/pending-approval` for protected member features.

Member-facing business rules are enforced server-side through auth helpers, permission helpers, and services. Client UI state is used for ergonomics only and must not be treated as authorization.

## Admin Panel

The admin panel lives under `app/(protected)/admin`. The admin layout calls `requireAdmin()`, which requires an approved `admin` or `super_admin`.

Admin areas include:

- Dashboard metrics and queues
- Build review and publishing
- Event management and attendance
- Member approval, suspension, role changes, and archive actions
- Partner management and partnership inquiries
- Observability for cron runs and health signals

Super-admin-only behavior, such as promoting or demoting admins, is enforced in domain services with `assertSuperAdmin()`.

## API Routes

API routes live under `app/api`.

Conventions:

- Use route handlers for browser/API integration points, not business logic.
- Validate request payloads with Zod schemas or typed service inputs.
- Use `requireApiAuth()`, `requireApiApprovedUser()`, or `requireApiAdmin()` for protected JSON routes.
- Use `Authorization: Bearer ${CRON_SECRET}` for cron routes.
- Return minimal JSON results and avoid leaking internal errors.

Important route groups:

- `/api/push/*` handles subscription status, subscribe, and unsubscribe.
- `/api/events/[eventId]/attendance/check-in` handles member QR check-in.
- `/api/admin/events/[eventId]/attendance/qr` creates rotating attendance QR tokens.
- `/api/cron/*` runs scheduled maintenance and notification work.
- `/api/webhooks/clerk` syncs Clerk users into the internal `users` table.
- `/api/uploadthing` handles upload routes.

## Domain Services

Newer business rules are centralized in `src/features/*`:

- `BuildService` owns submit, publish, reject, archive, and restore workflows.
- `MemberService` owns member approval, rejection, suspension, archive, and role changes.
- `EventService` owns event create, update, publish, cancel, and complete workflows.
- `AttendanceService` owns QR token creation, geofence check-in, attendance listing, and removal.
- `PartnerService` owns partner create/update/archive style workflows.
- `NotificationService` owns push subscription storage and push delivery.
- `audit-service` owns append-only audit records.

Server Actions and route handlers should authenticate, parse inputs, call the service, revalidate or redirect, and return a user-safe result.

## Event Bus

The typed event bus lives in `src/lib/events/event-bus.ts`. Handlers are registered by `registerDomainEventHandlers()` in `src/lib/events/handlers/index.ts`.

Current handlers:

- `auditLogHandler` maps supported domain events into `audit_logs`.
- `pushNotificationHandler` sends relevant push notifications.

Handler errors are isolated and logged as `[DOMAIN_EVENT_HANDLER_FAILED]` so secondary side effects do not break the primary action after it has completed.

## Request Flow

Typical protected mutation flow:

1. User submits a form or calls an API route.
2. Server Action or route handler authenticates with Clerk-backed helpers.
3. Input is validated with Zod or service-level validation.
4. A domain service enforces authorization and state rules.
5. Drizzle writes to PostgreSQL.
6. The service emits a typed domain event when needed.
7. Event handlers write audit logs and send push notifications.
8. The route or action revalidates affected pages and returns a safe response.
