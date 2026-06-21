# Boys of ADV

Boys of ADV is a mobile-first community platform for Honda ADV riders. It includes the public website, member portal, and admin panel for member builds, events, memberships, partners, sponsors, and notifications.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Clerk Authentication
- PostgreSQL
- Drizzle ORM
- UploadThing
- Web Push Notifications
- Vercel Cron Jobs
- PWA support with `next-pwa`

## Prerequisites

Install these before setting up the project:

- [Node.js 20 LTS or newer](https://nodejs.org/en/download)
- [pnpm](https://pnpm.io/installation)
- [Docker Desktop](https://docs.docker.com/desktop/) for the local PostgreSQL database
- [Git](https://git-scm.com/downloads)
- Optional: [Vercel CLI](https://vercel.com/docs/cli) for pulling production or preview environment variables

This repository uses a pnpm lockfile. On Windows PowerShell, use `pnpm.cmd` if the `pnpm` shim is blocked by execution policy.

## Quick Start

```powershell
git clone <repository-url>
cd boysofadv
pnpm install
New-Item -ItemType File .env
```

Fill `.env` from the template in the Environment Variables section below.

Start the local database:

```powershell
docker compose up -d postgres
```

Apply database migrations:

```powershell
pnpm exec drizzle-kit migrate
```

Optionally seed the local super admin record:

```powershell
pnpm seed:super-admin
```

Run the development server:

```powershell
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a local `.env` file in the project root. Never commit real secrets.

### Required for Local Development

| Variable | Purpose | Guide |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by the app and Drizzle migrations. | [PostgreSQL connection strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING) |
| `NEXT_PUBLIC_APP_URL` | Public app origin used for QR check-in links and absolute URLs. Use `http://localhost:3000` locally. | [Next.js environment variables](https://nextjs.org/docs/app/guides/environment-variables) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Public Clerk frontend key. | [Clerk Next.js setup](https://clerk.com/docs/quickstarts/nextjs) |
| `CLERK_SECRET_KEY` | Server-side Clerk API key. | [Clerk environment variables](https://clerk.com/docs/deployments/clerk-environment-variables) |
| `CRON_SECRET` | Bearer token required by protected cron routes. | [Vercel cron jobs](https://vercel.com/docs/cron-jobs) |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Public VAPID key for browser push subscriptions. | [web-push VAPID details](https://github.com/web-push-libs/web-push#command-line) |
| `VAPID_PRIVATE_KEY` | Private VAPID key for sending web push notifications. | [web-push VAPID details](https://github.com/web-push-libs/web-push#command-line) |
| `VAPID_SUBJECT` | Contact subject for VAPID, usually `mailto:you@example.com` or your site URL. | [web-push VAPID details](https://github.com/web-push-libs/web-push#command-line) |

### Feature and Production Variables

| Variable | Purpose | Guide |
| --- | --- | --- |
| `UPLOADTHING_TOKEN` | Enables UploadThing uploads and file management for build images, event posters, and partner logos. | [UploadThing environment variables](https://docs.uploadthing.com/getting-started/appdir#add-env-variables) |
| `CLERK_WEBHOOK_SIGNING_SECRET` | Verifies Clerk webhook events. Required when Clerk webhooks are enabled. | [Clerk webhooks](https://clerk.com/docs/webhooks/sync-data) |
| `SUPER_ADMIN_EMAIL` | Email address promoted to `super_admin` when the Clerk webhook creates or syncs a matching user. | [Clerk user webhooks](https://clerk.com/docs/webhooks/sync-data) |
| `ATTENDANCE_TOKEN_SECRET` | HMAC secret for event attendance QR tokens. Falls back to `AUTH_SECRET` if unset. | [Node.js crypto HMAC](https://nodejs.org/api/crypto.html#cryptocreatehmacalgorithm-key-options) |
| `AUTH_SECRET` | Fallback signing secret used by attendance token helpers if `ATTENDANCE_TOKEN_SECRET` is absent. | [Node.js crypto HMAC](https://nodejs.org/api/crypto.html#cryptocreatehmacalgorithm-key-options) |
| `DATABASE_URL_UNPOOLED` | Optional direct database URL for providers that expose pooled and unpooled connections. | [Vercel Postgres connection strings](https://vercel.com/docs/storage/vercel-postgres) |
| `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, `POSTGRES_URL_NO_SSL`, `POSTGRES_HOST`, `POSTGRES_DATABASE`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `PGHOST`, `PGHOST_UNPOOLED`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` | Optional provider-generated Postgres variables. The app itself reads `DATABASE_URL`; keep these only when your hosting/database provider supplies them. | [Vercel Postgres connection strings](https://vercel.com/docs/storage/vercel-postgres) |
| `VERCEL_OIDC_TOKEN` | Optional Vercel-provided token for integrations that use Vercel OIDC. | [Vercel OIDC](https://vercel.com/docs/oidc) |
| `ANALYZE` | Set to `true` to enable the Next.js bundle analyzer during builds. | [Next.js bundle analyzer](https://nextjs.org/docs/app/guides/package-bundling#analyzing-javascript-bundles) |

### Clerk Route Variables

These are public route settings consumed by Clerk:

```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/member
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/member
```

See [Clerk Next.js routing](https://clerk.com/docs/references/nextjs/custom-signup-signin-pages).

### Local `.env` Template

```env
DATABASE_URL=postgres://boysofadv:boysofadv_password@localhost:5432/boysofadv_db
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_replace_me
CLERK_SECRET_KEY=sk_test_replace_me
CLERK_WEBHOOK_SIGNING_SECRET=whsec_replace_me
SUPER_ADMIN_EMAIL=admin@example.com

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/member
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/member

UPLOADTHING_TOKEN=replace_me

CRON_SECRET=replace_with_a_long_random_secret
ATTENDANCE_TOKEN_SECRET=replace_with_a_long_random_secret

NEXT_PUBLIC_VAPID_PUBLIC_KEY=replace_me
VAPID_PRIVATE_KEY=replace_me
VAPID_SUBJECT=mailto:admin@example.com
```

Generate VAPID keys with:

```powershell
pnpm exec web-push generate-vapid-keys
```

Generate random local secrets with Node:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Database Setup

The repository includes `docker-compose.yaml` with a PostgreSQL 16 service:

- Host: `localhost`
- Port: `5432`
- Database: `boysofadv_db`
- User: `boysofadv`
- Password: `boysofadv_password`

Use this local connection string:

```env
DATABASE_URL=postgres://boysofadv:boysofadv_password@localhost:5432/boysofadv_db
```

Start and stop the database:

```powershell
docker compose up -d postgres
docker compose ps
docker compose stop postgres
```

Reset local data without dropping the schema:

```powershell
pnpm reset:db
```

Open Drizzle Studio:

```powershell
pnpm exec drizzle-kit studio
```

## Migration Guide

Drizzle configuration lives in `drizzle.config.ts`.

- Schema source: `db/schema/index.ts`
- Migration output: `db/migrations`
- Database URL: `DATABASE_URL`

Apply existing migrations after cloning:

```powershell
pnpm exec drizzle-kit migrate
```

Create a migration after changing files in `db/schema`:

```powershell
pnpm exec drizzle-kit generate
```

Review the generated SQL in `db/migrations`, then apply it:

```powershell
pnpm exec drizzle-kit migrate
```

For local-only schema experiments, you can push schema changes directly:

```powershell
pnpm exec drizzle-kit push
```

Do not use `push` for shared, preview, or production databases. Generate and commit migrations instead.

## Clerk Setup

1. Create a Clerk application from the [Clerk dashboard](https://dashboard.clerk.com/).
2. Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` into `.env`.
3. Configure sign-in and sign-up URLs to match the route variables above.
4. If webhooks are enabled, add an endpoint for `/api/webhooks/clerk` and copy the signing secret into `CLERK_WEBHOOK_SIGNING_SECRET`.
5. Set `SUPER_ADMIN_EMAIL` to the email address that should receive the `super_admin` role when synced.

For local webhook testing, expose the dev server with a tunnel such as [ngrok](https://ngrok.com/docs) and update `NEXT_PUBLIC_APP_URL` to the tunnel URL while testing.

## UploadThing Setup

1. Create an UploadThing app in the [UploadThing dashboard](https://uploadthing.com/dashboard).
2. Copy `UPLOADTHING_TOKEN` into `.env`.
3. Keep the upload route mounted at `/api/uploadthing`.

Uploads are used by member builds, gallery images, event posters, and partner logos.

## Web Push Setup

1. Generate VAPID keys:

```powershell
pnpm exec web-push generate-vapid-keys
```

2. Save the public key as `NEXT_PUBLIC_VAPID_PUBLIC_KEY`.
3. Save the private key as `VAPID_PRIVATE_KEY`.
4. Set `VAPID_SUBJECT` to a contact value such as `mailto:admin@example.com`.

Push subscriptions and cleanup jobs depend on these values.

## Common Terminal Commands

```powershell
pnpm install
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm typecheck
pnpm test
pnpm test:unit
pnpm test:integration
pnpm test:e2e
pnpm test:coverage
pnpm format
pnpm format:check
pnpm seed:super-admin
pnpm reset:db
pnpm exec drizzle-kit generate
pnpm exec drizzle-kit migrate
pnpm exec drizzle-kit studio
```

## Verification Checklist

Run these before considering a clone ready for use:

```powershell
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:integration
pnpm build
```

Run end-to-end tests only after configuring the Playwright storage state variables required by the specs:

```powershell
pnpm test:e2e
```

Optional E2E variables used by the test suite:

```env
E2E_ADMIN_STORAGE_STATE=playwright/.auth/admin.json
E2E_MEMBER_STORAGE_STATE=playwright/.auth/member.json
E2E_PENDING_MEMBER_STORAGE_STATE=playwright/.auth/pending-member.json
E2E_EVENT_CHECK_IN_PATH=/events/test-event/check-in
TEST_DATABASE_URL=postgres://boysofadv:boysofadv_password@localhost:5432/boysofadv_test
```

## Deployment Notes

- Configure all required environment variables in Vercel before deploying.
- Keep `CRON_SECRET` the same value expected by Vercel Cron requests.
- Run Drizzle migrations against the target database before promoting a deployment.
- Confirm UploadThing, Clerk webhooks, and push notification keys are configured for the deployed domain.
- `vercel.json` defines scheduled cron routes under `/api/cron/*`.

## Troubleshooting

- Database connection errors: confirm Docker is running, `docker compose ps` shows `postgres` healthy, and `DATABASE_URL` matches the local connection string.
- Missing environment check: verify the required variables in `.env`, then restart `pnpm dev`.
- Upload failures: verify `UPLOADTHING_TOKEN` and allowed image domains in `next.config.ts`.
- Clerk auth failures: verify Clerk keys, sign-in/sign-up URLs, and webhook signing secret.
- Push notification failures: regenerate VAPID keys and make sure the public and private keys are from the same pair.
