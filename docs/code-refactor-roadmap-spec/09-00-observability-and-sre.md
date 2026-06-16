# Phase 9 — Observability & SRE

## Goal

Make production issues visible, traceable, and easier to debug before they become user-facing failures.

This phase adds:

- Health check endpoint
- Runtime configuration validation
- Database connectivity check
- Push notification configuration check
- Cron execution tracking
- Basic failure visibility
- Foundation for future Sentry integration

---

# 1. Health Check Endpoint

## Route

```txt
GET /api/health
```

## Purpose

Provide a single endpoint that verifies whether the application is healthy enough to serve traffic.

This endpoint should be useful for:

- Manual production checks
- Uptime monitoring
- Debugging deployment issues
- Future automated alerting
- SRE dashboards

---

## Health Check Response

### Successful Response

```json
{
  "status": "ok",
  "timestamp": "2026-06-16T00:00:00.000Z",
  "checks": {
    "app": {
      "status": "ok"
    },
    "database": {
      "status": "ok"
    },
    "environment": {
      "status": "ok"
    },
    "push": {
      "status": "ok"
    }
  }
}
```

### Degraded Response

```json
{
  "status": "degraded",
  "timestamp": "2026-06-16T00:00:00.000Z",
  "checks": {
    "app": {
      "status": "ok"
    },
    "database": {
      "status": "error",
      "message": "Database connection failed"
    },
    "environment": {
      "status": "ok"
    },
    "push": {
      "status": "ok"
    }
  }
}
```

---

## HTTP Status Rules

| Overall Status | HTTP Status |
| -------------- | ----------: |
| `ok`           |       `200` |
| `degraded`     |       `503` |

---

# 2. Health Checks

## 2.1 App Status Check

### Purpose

Confirm the app runtime is alive.

### Requirements

The app check should return `ok` if the route can execute successfully.

```json
{
  "status": "ok"
}
```

---

## 2.2 Database Connection Check

### Purpose

Confirm the app can connect to PostgreSQL.

### Requirements

Run a lightweight query:

```sql
SELECT 1
```

### Success

```json
{
  "status": "ok"
}
```

### Failure

```json
{
  "status": "error",
  "message": "Database connection failed"
}
```

### Notes

Do not expose raw database credentials, connection strings, or internal stack traces.

---

## 2.3 Environment Variable Check

### Purpose

Confirm required runtime environment variables exist.

### Required Variables

```txt
DATABASE_URL
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CRON_SECRET
NEXT_PUBLIC_APP_URL
```

### Push-Related Variables

```txt
NEXT_PUBLIC_VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
VAPID_EMAIL
```

### Requirements

The health check should only report whether required variables are configured.

Do not return secret values.

### Example

```json
{
  "status": "ok",
  "missing": []
}
```

### Failure Example

```json
{
  "status": "error",
  "missing": ["CRON_SECRET"]
}
```

---

## 2.4 Push Notification Config Check

### Purpose

Confirm push notification infrastructure is configured.

### Requirements

Check that the following exist:

```txt
NEXT_PUBLIC_VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
VAPID_EMAIL
```

### Success

```json
{
  "status": "ok"
}
```

### Failure

```json
{
  "status": "error",
  "message": "Push notification config incomplete",
  "missing": ["VAPID_PRIVATE_KEY"]
}
```

---

# 3. Cron Monitoring

## Goal

Track every scheduled job execution so production cron issues are visible.

---

# 4. Database Table: `cron_runs`

## Table Name

```txt
cron_runs
```

## Purpose

Store execution history for all cron jobs.

---

## Columns

| Column            | Type        | Required | Notes                          |
| ----------------- | ----------- | -------: | ------------------------------ |
| `id`              | text / uuid |      Yes | Primary key                    |
| `cron_name`       | text        |      Yes | Example: `event-reminders`     |
| `started_at`      | timestamp   |      Yes | When job started               |
| `completed_at`    | timestamp   |       No | When job finished              |
| `status`          | text / enum |      Yes | `running`, `success`, `failed` |
| `error_message`   | text        |       No | Sanitized error message        |
| `processed_count` | integer     |      Yes | Default `0`                    |
| `metadata`        | jsonb       |       No | Optional job details           |
| `created_at`      | timestamp   |      Yes | Default now                    |
| `updated_at`      | timestamp   |      Yes | Default now                    |

---

## Suggested Status Values

```ts
type CronRunStatus = "running" | "success" | "failed";
```

---

## Suggested Drizzle Schema

```ts
export const cronRuns = pgTable("cron_runs", {
  id: text("id").primaryKey(),
  cronName: text("cron_name").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  status: text("status").notNull().default("running"),
  errorMessage: text("error_message"),
  processedCount: integer("processed_count").notNull().default(0),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
```

---

# 5. Cron Monitoring Helper

## File

```txt
src/lib/cron/cron-monitor.ts
```

## Purpose

Provide reusable helpers for tracking cron execution.

---

## Required API

```ts
createCronRun({
  cronName,
  metadata,
});

completeCronRun({
  cronRunId,
  processedCount,
  metadata,
});

failCronRun({
  cronRunId,
  errorMessage,
  processedCount,
  metadata,
});
```

---

## Recommended Wrapper

Use a wrapper so every cron route has consistent monitoring.

```ts
await monitorCronRun({
  cronName: "event-reminders",
  handler: async () => {
    // cron logic here

    return {
      processedCount: 10,
      metadata: {
        remindersSent: 10,
      },
    };
  },
});
```

---

# 6. Cron Routes to Track

Apply monitoring to all existing scheduled jobs.

```txt
/api/cron/update-status
/api/cron/event-reminders
/api/cron/pending-approvals
/api/cron/build-review-reminder
/api/cron/event-attendance-summary
/api/cron/inactive-members
/api/cron/build-popularity
/api/cron/cleanup-expired-push-subscriptions
/api/cron/cleanup-database
/api/cron/cleanup-orphan-files
```

---

# 7. Cron Run Rules

## On Start

Insert a new `cron_runs` record:

```txt
status = running
started_at = now
processed_count = 0
```

## On Success

Update the record:

```txt
status = success
completed_at = now
processed_count = result.processedCount
metadata = result.metadata
```

## On Failure

Update the record:

```txt
status = failed
completed_at = now
error_message = sanitized error
processed_count = processed count if available
metadata = failure context if safe
```

---

# 8. Admin Visibility

## Add Admin Page

```txt
/admin/observability
```

## Sections

### Health Status

Display latest `/api/health` result.

### Cron Runs

Show recent cron executions.

Columns:

- Cron name
- Status
- Started at
- Completed at
- Duration
- Processed count
- Error message

### Filters

- Cron name
- Status
- Date range

---

# 9. Error Monitoring

## Goal

Prepare the system for Sentry or similar monitoring later.

---

## Initial Requirements

Do not fully implement Sentry yet unless explicitly planned.

For now:

- Use consistent server-side error logging.
- Sanitize error messages before storing.
- Avoid exposing stack traces in API responses.
- Keep cron failure metadata safe.
- Create a future integration point.

---

## Suggested Future Files

```txt
src/lib/observability/error-monitor.ts
src/lib/observability/logger.ts
```

---

## Future API

```ts
captureError(error, {
  source: "cron",
  cronName: "event-reminders",
  userId,
  entityType,
  entityId,
});
```

Later this can forward errors to:

```txt
Sentry
Logtail
Axiom
Datadog
```

---

# 10. Security Requirements

## Health Endpoint

The health endpoint must not expose:

- Secret values
- Database URLs
- Clerk keys
- VAPID private key
- Stack traces
- Internal file paths

## Cron Monitoring

Stored error messages must be sanitized.

Allowed:

```txt
Database connection failed
Push send failed
Missing required environment variable
```

Avoid:

```txt
Full stack traces
Raw SQL connection strings
Private API keys
Request headers
Cookies
Auth tokens
```

---

# 11. Acceptance Criteria

Phase 9 is complete when:

- `/api/health` exists.
- App status is checked.
- Database connection is checked.
- Required environment variables are checked.
- Push notification configuration is checked.
- Health endpoint returns `200` when healthy.
- Health endpoint returns `503` when degraded.
- `cron_runs` table exists.
- Every cron job creates a `running` record when started.
- Successful cron jobs update to `success`.
- Failed cron jobs update to `failed`.
- Cron records include processed count.
- Cron records include safe error messages.
- Admin can view recent cron runs.
- Error monitoring integration point exists for future Sentry setup.
