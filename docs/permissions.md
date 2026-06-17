# Permissions

## Overview

Authentication is handled by Clerk. Authorization is enforced by internal user records in `users`, permission helpers in `lib/permissions`, auth helpers in `lib/auth`, and domain service assertions in `src/features/shared/service-actor.ts`.

Client controls can hide unavailable actions, but the server must enforce every protected action.

## Roles

| Role          | Meaning                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------ |
| `super_admin` | Full administrative access, including admin role management.                               |
| `admin`       | Administrative access to members, builds, events, partners, attendance, and observability. |
| `member`      | Community member access after approval.                                                    |

## Member Statuses

| Status         | Meaning                                         |
| -------------- | ----------------------------------------------- |
| `for_approval` | Signed up but waiting for admin approval.       |
| `approved`     | May access protected member features.           |
| `rejected`     | Application rejected.                           |
| `suspended`    | Account disabled from protected member actions. |
| `archived`     | Removed from active member management flows.    |

Only approved members may use protected member features.

## Build Statuses

| Status        | Meaning                                                          |
| ------------- | ---------------------------------------------------------------- |
| `draft`       | Editable by the approved build owner.                            |
| `for_review`  | Submitted and waiting for admin review.                          |
| `published`   | Publicly visible.                                                |
| `unpublished` | Removed from public listing but still editable/admin manageable. |
| `rejected`    | Returned to owner with a rejection reason.                       |
| `archived`    | Removed from active workflows.                                   |

Owners can submit editable builds for review only when approved. Admins and super admins can publish, reject, archive, and restore according to service rules.

## Event Statuses

| Status      | Meaning                                               |
| ----------- | ----------------------------------------------------- |
| `draft`     | Admin-created event not publicly active.              |
| `published` | Public event and eligible for attendance QR check-in. |
| `completed` | Finished event.                                       |
| `cancelled` | Cancelled event with cancellation metadata.           |

Attendance check-in requires a published event, valid time window, valid rotating token, geofence match, and approved member status.

## Access Matrix

| Action                  | Public |              Member |                    Admin |              Super Admin |
| ----------------------- | -----: | ------------------: | -----------------------: | -----------------------: |
| View public builds      |    Yes |                 Yes |                      Yes |                      Yes |
| View public events      |    Yes |                 Yes |                      Yes |                      Yes |
| View public partners    |    Yes |                 Yes |                      Yes |                      Yes |
| Submit build            |     No | Yes, approved owner | Yes, if owner rules pass | Yes, if owner rules pass |
| Comment or like a build |     No |       Yes, approved |                      Yes |                      Yes |
| Publish build           |     No |                  No |                      Yes |                      Yes |
| Reject build            |     No |                  No |                      Yes |                      Yes |
| Approve member          |     No |                  No |                      Yes |                      Yes |
| Suspend member          |     No |                  No |                      Yes |                      Yes |
| Promote admin           |     No |                  No |                       No |                      Yes |
| Demote admin            |     No |                  No |                       No |                      Yes |
| Manage events           |     No |                  No |                      Yes |                      Yes |
| Create attendance QR    |     No |                  No |                      Yes |                      Yes |
| Check in to event       |     No |       Yes, approved |            Yes, approved |            Yes, approved |
| Manage partners         |     No |                  No |                      Yes |                      Yes |
| Manage partnerships     |     No |                  No |                      Yes |                      Yes |
| View cron observability |     No |                  No |                      Yes |                      Yes |
| Run cron endpoint       |     No |                  No |       Bearer cron secret |       Bearer cron secret |

## Public Access Rules

Public users may read public pages and submit public partner inquiries where exposed by the UI. They may not mutate builds, events, comments, likes, attendance, push subscriptions, member records, or partner directory entries.

## Member-Only Actions

Approved members may:

- Update profile and build details.
- Submit eligible builds for review.
- Like and comment on public builds.
- Subscribe and unsubscribe from push notifications.
- Check in to published events with a valid QR token and geofence match.

Non-approved authenticated users are routed to `/pending-approval` for protected member features.

## Admin-Only Actions

Approved admins and super admins may:

- Review, publish, reject, archive, and restore builds.
- Approve, reject, suspend, mark active, and archive members.
- Create, update, publish, complete, and cancel events.
- Generate attendance QR codes and review attendance.
- Manage partners.
- View dashboard and observability data.

Super admins additionally manage admin promotion and demotion.

## Permission Helper Usage

Use the narrow helper that matches the boundary:

- `requireAuth()` for authenticated-only server paths.
- `requireApprovedUser()` for member pages and Server Actions.
- `requireAdmin()` for admin pages and Server Actions.
- `requireApiAuth()`, `requireApiApprovedUser()`, and `requireApiAdmin()` for JSON route handlers.
- `canManageMembers()`, `canManageBuild()`, `canEditBuild()`, `canSubmitBuildForReview()`, `canPublishBuild()`, `canManageEvents()`, and `canManagePartners()` for local permission decisions.
- `assertApprovedAdmin()` and `assertSuperAdmin()` inside services when the service owns the business rule.

Never rely on route grouping or hidden buttons as the only authorization layer.
