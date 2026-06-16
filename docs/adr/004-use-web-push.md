# ADR 004: Use Web Push

## Status

Accepted

## Context

Boys of ADV needs timely alerts for member approvals, build review outcomes, event updates, event reminders, admin digests, and engagement notifications. The app is mobile-first and PWA-enabled, so browser-native push is a good fit.

## Decision

Use Web Push with VAPID keys. Store browser subscriptions in `push_subscriptions` and send through `NotificationService`.

## Consequences

- Notifications work through browser-native push without requiring a separate mobile app.
- Members and admins can receive event reminders and workflow alerts.
- Delivery can target one user, all approved members, or approved admins.
- Browser permission prompts can reduce opt-in rates.
- Subscriptions expire or become invalid, so delivery must remove 404/410 endpoints and scheduled cleanup must prune stale records.
- VAPID keys must be configured in every deployed environment.

## Alternatives Considered

- Email notifications: useful for some workflows, but less immediate and not currently the primary channel.
- Native mobile push: stronger mobile UX, but requires native apps.
- In-app-only notifications: simpler, but does not reach users when they are away from the site.
