# Deployment

## Overview

Boys of ADV is deployed as a Next.js application on Vercel with PostgreSQL, Clerk, UploadThing, Web Push, and Vercel Cron.

## Vercel Deployment Process

1. Push changes to the connected Git repository.
2. Vercel builds the app with `pnpm.cmd build` equivalent behavior using `next build --webpack`.
3. Environment variables are read from the Vercel project settings.
4. Cron schedules are loaded from `vercel.json`.
5. The app serves public pages, protected Clerk pages, API routes, and service worker/PWA assets.

## Required Environment Variables

Application health checks expect:

- `DATABASE_URL`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CRON_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`

Other integration variables are required by their providers and UploadThing setup, including UploadThing token/secret values used by the upload route.

Attendance QR tokens also require `ATTENDANCE_TOKEN_SECRET` or `AUTH_SECRET`.

## PostgreSQL Setup

1. Provision a PostgreSQL database.
2. Set `DATABASE_URL` in Vercel and local environments.
3. Run Drizzle migrations against the target database.
4. Verify generated enums, indexes, foreign keys, and search vector migrations are present.

## Clerk Setup

1. Create a Clerk application.
2. Configure sign-in and sign-up routes for the Next.js app.
3. Set `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
4. Configure the Clerk webhook endpoint at `/api/webhooks/clerk`.
5. Ensure `SUPER_ADMIN_EMAIL` is configured for initial super admin assignment where needed.

The Clerk webhook creates internal `users` rows. The project stores role and member status internally rather than depending only on Clerk metadata.

## UploadThing Setup

1. Configure UploadThing credentials in Vercel.
2. Confirm `/api/uploadthing` is deployed.
3. Verify upload routes for build covers, gallery images, event posters, and partner logos.
4. Keep `*_key` columns stored with public URLs so orphan cleanup can reconcile storage with database state.

## Web Push Setup

1. Generate VAPID keys.
2. Set `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_SUBJECT`.
3. Verify browser subscription, unsubscribe, and status endpoints.
4. Confirm the PWA service worker is generated in production builds.

## Cron Secret Setup

Set `CRON_SECRET` in Vercel. Every cron route expects:

```txt
Authorization: Bearer <CRON_SECRET>
```

Vercel cron invocations must include the configured secret. Manual invocations must use the same header.

## Migration Process

1. Review schema changes in `db/schema`.
2. Generate migrations with Drizzle.
3. Inspect generated SQL before applying.
4. Apply migrations to staging first when available.
5. Apply migrations to production before deploying code that depends on new schema.
6. Verify representative reads and writes after migration.

Useful local commands on Windows:

```powershell
.\node_modules\.bin\drizzle-kit.cmd generate
cmd.exe /c .\node_modules\.bin\drizzle-kit.cmd migrate
```

## Seed Process

The repo includes a super admin seed script:

```powershell
pnpm.cmd seed:super-admin
```

Use this only in controlled environments where the intended super admin identity is known.

## Production Safety Checklist

- Environment health checks report no missing required variables.
- Database migrations have been applied.
- Clerk webhook signing and destination are configured.
- UploadThing credentials and routes are working.
- VAPID keys and subject are valid.
- `CRON_SECRET` is set and cron endpoints reject missing or invalid auth.
- PWA service worker output is expected for the deployment.
- Admin and member permission checks are verified server-side.
- Public pages render without requiring protected data.
- Observability page can inspect recent cron runs.
