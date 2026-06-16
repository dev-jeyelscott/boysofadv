# Notifications

## Overview

Boys of ADV uses browser Web Push for member and admin notifications. Push delivery is centralized in `NotificationService` and exposed through legacy wrappers in `lib/send-push-notification.ts`.

Push is best effort. The system logs delivery summaries and removes expired browser endpoints when providers return expiration status codes.

## VAPID Config

Required environment variables:

- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`

`VAPID_SUBJECT` must be a valid `mailto:` or HTTPS subject. `lib/push.ts` validates the push configuration and returns a missing-config result instead of crashing runtime delivery paths.

## Subscription Storage

Subscriptions are stored in `push_subscriptions`:

- `user_id`
- `endpoint`
- `p256dh`
- `auth`
- timestamps

`endpoint` is unique. Re-subscribing updates the stored keys, owner, and `updated_at`.

## Subscribe Endpoint

`POST /api/push/subscribe`

Rules:

- Requires `requireApiApprovedUser()`.
- Parses the browser subscription with `pushSubscriptionSchema`.
- Calls `NotificationService.registerSubscription()`.
- Inserts or updates by endpoint.

## Unsubscribe Endpoint

`POST /api/push/unsubscribe`

Rules:

- Requires `requireApiApprovedUser()`.
- Deletes only the endpoint owned by the current user.
- Returns success even when the endpoint is already gone.

## Status Endpoint

`GET /api/push/status`

Rules:

- Requires `requireApiApprovedUser()`.
- Checks whether the current user has any stored subscription, or a matching endpoint when one is provided.
- Returns whether push is enabled for the current browser context.

## Delivery Targets

`NotificationService` supports:

- `notifyUser()` for one user.
- `notifyAdmins()` for approved admins and super admins.
- `notifyApprovedMembers()` for all approved users.

Delivery logs `[PUSH_DELIVERY_SUMMARY]` with attempted, sent, failed, and removed subscription counts.

## Notification Triggers

| Trigger                       | Recipient        | Source                                                      |
| ----------------------------- | ---------------- | ----------------------------------------------------------- |
| Build published               | Build owner      | `build.published` event handler                             |
| Build rejected                | Build owner      | `build.rejected` event handler                              |
| Event created                 | Approved members | `event.created` event handler when notification is queued   |
| Event updated                 | Approved members | `event.updated` event handler when notification is queued   |
| Event cancelled               | Approved members | `event.cancelled` event handler when notification is queued |
| Build liked                   | Build owner      | Build action notification path                              |
| Pending approval digest       | Admins           | `/api/cron/pending-approvals`                               |
| Event reminders               | Approved members | `/api/cron/event-reminders`                                 |
| Build review reminders        | Admins           | `/api/cron/build-review-reminder`                           |
| Member approved               | Member           | `member.approved` event handler                             |
| Partnership inquiry           | Admins           | Public partner inquiry action                               |
| Clerk signup needing approval | Admins           | Clerk webhook path                                          |

## Admin Notifications

Admin notifications are sent to users with role `admin` or `super_admin` and status `approved`.

Admin-oriented notifications include pending approval digests, build review reminders, event attendance summaries, inactive member detection, partner inquiries, and new member signup review alerts.

## Member Notifications

Member notifications are sent to approved users or a specific user depending on the workflow.

Member-oriented notifications include membership approval, build review outcomes, event publication/updates/cancellations, event reminders, and build engagement alerts.

## Expired Subscription Cleanup

Expired endpoints are removed in two ways:

- During delivery, provider status `404` or `410` is treated as expired and the endpoint is deleted.
- `/api/cron/cleanup-expired-push-subscriptions` removes stale subscriptions by `updated_at`.

Delivery errors log `[PUSH_SEND_FAILED]` with a redacted endpoint hash, status code, and whether the subscription was removed.
