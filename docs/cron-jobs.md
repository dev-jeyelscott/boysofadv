# Cron Jobs

## Overview

Scheduled jobs live under `app/api/cron/*` and are scheduled by `vercel.json`. Each job requires:

```txt
Authorization: Bearer <CRON_SECRET>
```

Most jobs are wrapped with `monitorCronRun()`, which records status, timings, processed count, error messages, and metadata in `cron_runs`.

## Schedule Table

| Job                               | Endpoint                                       | Schedule              | Purpose                                                               |
| --------------------------------- | ---------------------------------------------- | --------------------- | --------------------------------------------------------------------- |
| Event Status Automation           | `/api/cron/update-status`                      | `0 22 * * *`          | Completes or updates event state based on timing rules.               |
| Upcoming Event Reminders          | `/api/cron/event-reminders`                    | `0 23 * * *`          | Sends upcoming event push reminders to approved members.              |
| Pending Approval Digest           | `/api/cron/pending-approvals`                  | `0 22 * * *`          | Notifies admins about pending members, builds, and partner inquiries. |
| Build Review Reminder             | `/api/cron/build-review-reminder`              | `5 22 * * *`          | Reminds approved admins about builds waiting for review.              |
| Event Attendance Summary          | `/api/cron/event-attendance-summary`           | `10 22 * * *`         | Sends admin summaries for completed events.                           |
| Inactive Member Detection         | `/api/cron/inactive-members`                   | `0 1 * * *`           | Detects approved members with stale activity.                         |
| Build Popularity Calculation      | `/api/cron/build-popularity`                   | `0 20 * * *`          | Recalculates build popularity scores.                                 |
| Expired Push Subscription Cleanup | `/api/cron/cleanup-expired-push-subscriptions` | `0 19 * * 0`          | Removes old push subscription records.                                |
| Orphan File Cleanup               | `/api/cron/orphan-file-cleanup`                | `15 19 * * 0`         | Removes UploadThing files no longer referenced by database records.   |
| Database Cleanup                  | `/api/cron/cleanup-database`                   | Manual or unscheduled | Runs database cleanup logic when invoked with cron auth.              |

## Failure Handling

Cron failures should:

- Return `401` when the bearer secret is missing or invalid.
- Log errors through `captureError()` with `source: "cron"`.
- Mark `cron_runs.status` as `failed` when monitored.
- Store a user-safe error message in the JSON response.
- Avoid leaking secrets or raw tokens in logs.

## Related Database Fields

| Area               | Fields                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| Cron monitoring    | `cron_runs.cron_name`, `started_at`, `completed_at`, `status`, `processed_count`, `metadata`, `error_message` |
| Event status       | `events.status`, `starts_at`, `ends_at`, `completedAt`, `cancelled_at`                                        |
| Event reminders    | `event_reminders.event_id`, `reminder_type`, `sent_at`                                                        |
| Attendance summary | `events.attendance_summary_sent_at`, `event_attendance.checked_in_at`                                         |
| Inactive members   | `users.last_active_at`, `users.inactive_detected_at`                                                          |
| Build popularity   | `builds.popularity_score`, `builds.popularity_calculated_at`                                                  |
| Push cleanup       | `push_subscriptions.updated_at`                                                                               |
| Orphan cleanup     | Upload key columns such as `cover_image_key`, `poster_image_key`, `logo_key`                                  |

## Job Details

### Event Status Automation

- Endpoint: `/api/cron/update-status`
- Auth: bearer `CRON_SECRET`
- Expected result: updates eligible event state and records processed count.
- Failure handling: captures cron error and returns a failed response.

### Upcoming Event Reminders

- Endpoint: `/api/cron/event-reminders`
- Auth: bearer `CRON_SECRET`
- Expected result: sends configured reminder windows and records sent reminder rows to avoid duplicates.
- Failure handling: captures cron error and returns a failed response.

### Pending Approval Digest

- Endpoint: `/api/cron/pending-approvals`
- Auth: bearer `CRON_SECRET`
- Expected result: notifies admins when pending members, builds, or partner inquiries exist.
- Failure handling: captures cron error and returns a failed response.

### Build Review Reminder

- Endpoint: `/api/cron/build-review-reminder`
- Auth: bearer `CRON_SECRET`
- Expected result: notifies approved admins when builds remain in review.
- Failure handling: captures cron error and returns a failed response.

### Event Attendance Summary

- Endpoint: `/api/cron/event-attendance-summary`
- Auth: bearer `CRON_SECRET`
- Expected result: sends summaries for completed events and updates `attendance_summary_sent_at`.
- Failure handling: captures cron error and returns a failed response.

### Inactive Member Detection

- Endpoint: `/api/cron/inactive-members`
- Auth: bearer `CRON_SECRET`
- Expected result: identifies inactive approved members and records detection metadata.
- Failure handling: captures cron error and returns a failed response.

### Build Popularity Calculation

- Endpoint: `/api/cron/build-popularity`
- Auth: bearer `CRON_SECRET`
- Expected result: recalculates build popularity values from engagement signals.
- Failure handling: captures cron error and returns a failed response.

### Expired Push Subscription Cleanup

- Endpoint: `/api/cron/cleanup-expired-push-subscriptions`
- Auth: bearer `CRON_SECRET`
- Expected result: deletes stale push subscriptions and reports deleted count.
- Failure handling: captures cron error and returns a failed response.

### Database Cleanup

- Endpoint: `/api/cron/cleanup-database`
- Auth: bearer `CRON_SECRET`
- Expected result: executes database maintenance cleanup and records status.
- Failure handling: captures cron error and returns a failed response.

### Orphan File Cleanup

- Endpoint: `/api/cron/orphan-file-cleanup`
- Auth: bearer `CRON_SECRET`
- Expected result: compares UploadThing files with database file keys and deletes eligible orphan files.
- Failure handling: captures cron error and returns a failed response.
