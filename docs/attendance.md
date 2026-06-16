# Attendance

## Overview

Event attendance uses short-lived QR tokens plus browser geolocation. The core logic lives in `AttendanceService`, with token creation in `lib/attendance-token.ts` and distance calculation in `lib/geo`.

## QR Check-In Flow

1. An approved admin opens an event attendance QR view.
2. The admin QR endpoint calls `AttendanceService.createQrToken()`.
3. The service verifies that the event exists and is `published`.
4. The endpoint builds a check-in URL with `NEXT_PUBLIC_APP_URL`, event id, and token.
5. An approved member scans the QR code.
6. The member browser submits the token and GPS coordinates.
7. `AttendanceService.checkIn()` verifies member status, token, event state, time window, and geofence.
8. The service inserts one attendance record and emits `attendance.checked_in`.

## Rotating Token Behavior

Attendance tokens are HMAC-signed with `ATTENDANCE_TOKEN_SECRET`, falling back to `AUTH_SECRET`.

Token payload:

- `eventId`
- random `nonce`
- `expiresAt`

Tokens expire after 30 seconds. The QR endpoint returns `expiresInSeconds: 30`, so the admin UI can refresh before tokens become stale.

## Geofence Validation

Each event stores:

- `latitude`
- `longitude`
- `geo_radius_meters`, defaulting to 80

Check-in calculates distance between member GPS coordinates and event coordinates. If the calculated distance is greater than the event radius, check-in is rejected.

## GPS Accuracy Handling

The client can submit `gpsAccuracyMeters`. The service stores it when provided. Current enforcement is based on calculated distance and configured radius; GPS accuracy is retained for review and debugging.

## Attendance Table Behavior

`event_attendance` stores:

- `event_id`
- `user_id`
- `status`
- submitted coordinates
- GPS accuracy
- calculated distance
- `checked_in_at`

Rows are ordered by `checked_in_at` for admin attendance views.

## Duplicate Check-In Rule

A unique index on `(event_id, user_id)` prevents duplicate check-ins. The service uses `onConflictDoNothing()` and returns a conflict error when the member already checked in.

## Valid Event Status Rules

QR creation and member check-in require the event to be `published`. Draft, completed, and cancelled events cannot accept attendance check-ins.

## Time Window Rules

Check-in requires `ends_at` to be configured. The current time must be between `starts_at` and `ends_at`.

If the event has no end time, starts in the future, or has already ended, check-in is rejected.

## Admin Attendance Summary

Approved admins can list and remove event attendance through `AttendanceService`. The scheduled attendance summary job sends admin summaries for completed events that have not yet had `attendance_summary_sent_at` recorded.
