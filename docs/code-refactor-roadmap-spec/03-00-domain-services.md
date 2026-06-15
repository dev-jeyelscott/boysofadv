# Phase 3 — Domain Services

## Goal

Move business logic out of API routes and Server Actions into reusable domain services.

API routes and Server Actions should become **thin wrappers** responsible only for:

1. Authentication
2. Input parsing
3. Calling a service method
4. Returning the response

Business rules must live in:

```txt
src/features/*/*-service.ts
```

---

## 1. Target Folder Structure

```txt
src/
  features/
    builds/
      build-service.ts
      build-types.ts
      build-validation.ts

    events/
      event-service.ts
      event-types.ts
      event-validation.ts

    members/
      member-service.ts
      member-types.ts
      member-validation.ts

    attendance/
      attendance-service.ts
      attendance-types.ts
      attendance-validation.ts

    notifications/
      notification-service.ts
      notification-types.ts
```

---

## 2. Service Rules

Each service must:

- Own business rules for its domain.
- Validate state transitions.
- Perform database writes.
- Call notification services when needed.
- Return predictable results.
- Throw typed errors for invalid operations.

Each service must **not**:

- Read raw `Request` objects.
- Return `NextResponse`.
- Depend directly on UI components.
- Duplicate logic from other services.
- Contain route-specific behavior.

---

## 3. Shared Service Error

Create:

```txt
src/lib/errors/service-error.ts
```

```ts
export class ServiceError extends Error {
  constructor(
    public code:
      | "UNAUTHORIZED"
      | "FORBIDDEN"
      | "NOT_FOUND"
      | "VALIDATION_ERROR"
      | "INVALID_STATE"
      | "CONFLICT",
    message: string,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}
```

---

## 4. Build Service

File:

```txt
src/features/builds/build-service.ts
```

### Responsibilities

Handles build lifecycle logic.

### Methods

```ts
BuildService.submitForReview(input);
BuildService.publish(input);
BuildService.reject(input);
BuildService.unpublish(input);
BuildService.archive(input);
```

### Business Rules

#### `submitForReview()`

Allowed when build status is:

```ts
"draft" | "rejected" | "unpublished";
```

Result:

```ts
status = "for_review";
submittedAt = now;
rejectionReason = null;
```

#### `publish()`

Allowed when build status is:

```ts
"for_review";
```

Result:

```ts
status = "published";
publishedAt = now;
reviewedAt = now;
reviewedBy = adminUserId;
```

Also sends notification to build owner.

#### `reject()`

Allowed when build status is:

```ts
"for_review";
```

Requires rejection reason.

Result:

```ts
status = "rejected";
reviewedAt = now;
reviewedBy = adminUserId;
rejectionReason = reason;
```

#### `unpublish()`

Allowed when build status is:

```ts
"published";
```

Result:

```ts
status = "unpublished";
publishedAt = null;
```

---

## 5. Member Service

File:

```txt
src/features/members/member-service.ts
```

### Responsibilities

Handles member approval and account status logic.

### Methods

```ts
MemberService.approve(input);
MemberService.reject(input);
MemberService.suspend(input);
MemberService.markActive(input);
MemberService.archive(input);
MemberService.promoteToAdmin(input);
MemberService.demoteToMember(input);
```

### Business Rules

#### `approve()`

Allowed when member status is:

```ts
"for_approval";
```

Result:

```ts
status = "approved";
approvedAt = now;
approvedBy = adminUserId;
```

Send push notification to member.

#### `suspend()`

Allowed when member status is:

```ts
"approved";
```

Result:

```ts
status = "suspended";
suspendedAt = now;
suspendedBy = adminUserId;
```

#### `markActive()`

Allowed when member status is:

```ts
"suspended";
```

Result:

```ts
status = "approved";
suspendedAt = null;
```

#### `promoteToAdmin()`

Allowed only by:

```ts
"super_admin";
```

Result:

```ts
role = "admin";
```

---

## 6. Event Service

File:

```txt
src/features/events/event-service.ts
```

### Responsibilities

Handles event creation, updates, publishing, cancellation, and status rules.

### Methods

```ts
EventService.create(input);
EventService.update(input);
EventService.publish(input);
EventService.cancel(input);
EventService.complete(input);
```

### Business Rules

#### `create()`

Creates event with default status:

```ts
"draft";
```

Required fields:

```ts
title;
description;
startsAt;
endsAt;
location;
```

Rules:

- `startsAt` must be before `endsAt`.
- Event cannot start in the past unless admin explicitly allows it.
- Geofence fields are optional.

#### `update()`

Allowed when status is:

```ts
"draft" | "published";
```

Rules:

- Cannot update cancelled events.
- Cannot update completed events.
- If published event date/location changes, notify approved members.

#### `publish()`

Allowed when status is:

```ts
"draft";
```

Result:

```ts
status = "published";
publishedAt = now;
```

Notify approved members.

#### `cancel()`

Allowed when status is:

```ts
"draft" | "published";
```

Result:

```ts
status = "cancelled";
cancelledAt = now;
cancelledBy = adminUserId;
cancellationReason = reason;
```

Notify approved members if event was already published.

---

## 7. Attendance Service

File:

```txt
src/features/attendance/attendance-service.ts
```

### Responsibilities

Handles QR check-in validation.

### Methods

```ts
AttendanceService.checkIn(input);
AttendanceService.getEventAttendance(input);
AttendanceService.removeAttendance(input);
```

### `checkIn()` Rules

Required input:

```ts
eventId;
memberId;
token;
latitude;
longitude;
gpsAccuracyMeters;
```

Validation:

- Member must be approved.
- Event must exist.
- Event must be published.
- Event must be ongoing or within allowed check-in window.
- QR token must be valid.
- User must be within geofence if geofence is enabled.
- Duplicate check-ins should be blocked.

Result:

```ts
eventId;
memberId;
checkedInAt;
gpsAccuracyMeters;
distanceMeters;
```

Duplicate behavior:

```ts
throw new ServiceError("CONFLICT", "Member already checked in");
```

---

## 8. Notification Service

File:

```txt
src/features/notifications/notification-service.ts
```

### Responsibilities

Central service for push notification logic.

### Methods

```ts
NotificationService.notifyUser(input);
NotificationService.notifyAdmins(input);
NotificationService.notifyApprovedMembers(input);
NotificationService.notifyBuildPublished(input);
NotificationService.notifyEventCreated(input);
NotificationService.notifyEventUpdated(input);
NotificationService.notifyEventCancelled(input);
```

### Rules

Notification service should:

- Load valid push subscriptions.
- Send push notifications.
- Remove expired subscriptions.
- Avoid throwing fatal errors when one notification fails.
- Return delivery summary.

Example result:

```ts
{
  attempted: 20,
  sent: 18,
  failed: 2,
  removedSubscriptions: 1
}
```

---

## 9. Thin API Route Pattern

Before:

```ts
export async function POST(req: Request) {
  const body = await req.json();

  // validation
  // database query
  // status checks
  // notifications
  // response handling
}
```

After:

```ts
export async function POST(req: Request) {
  try {
    const authUser = await requireAdmin();
    const body = await req.json();

    const result = await BuildService.publish({
      buildId: body.buildId,
      adminUserId: authUser.id,
    });

    return Response.json(result);
  } catch (error) {
    return handleServiceError(error);
  }
}
```

---

## 10. Service Response Pattern

Each service should return plain objects.

Example:

```ts
return {
  success: true,
  build,
};
```

Avoid returning:

```ts
NextResponse
Response
redirect()
toast messages
```

---

## 11. Auth Boundary

Authentication should stay near the route/action layer.

Example:

```ts
const authUser = await requireAdmin();

await BuildService.publish({
  buildId,
  adminUserId: authUser.id,
});
```

Services may still enforce role-sensitive rules when role data is passed in:

```ts
MemberService.promoteToAdmin({
  memberId,
  actorId,
  actorRole,
});
```

---

## 12. Migration Plan

### Step 1 — Create service files

Add empty service files for:

```txt
build-service.ts
event-service.ts
member-service.ts
attendance-service.ts
notification-service.ts
```

### Step 2 — Move build lifecycle logic

Start with:

```ts
submitForReview();
publish();
reject();
unpublish();
```

### Step 3 — Move member approval logic

Move:

```ts
approve();
suspend();
markActive();
promoteToAdmin();
```

### Step 4 — Move event logic

Move:

```ts
create();
update();
publish();
cancel();
```

### Step 5 — Move attendance check-in logic

Move QR validation, geofence validation, and duplicate check-in protection.

### Step 6 — Centralize notification calls

Replace direct push notification calls with:

```ts
NotificationService.notifyUser();
NotificationService.notifyAdmins();
NotificationService.notifyApprovedMembers();
```

### Step 7 — Refactor API routes

Routes should only:

```txt
auth → parse input → call service → return response
```

---

## 13. Definition of Done

Phase 3 is complete when:

- API routes no longer contain business rules.
- Server Actions no longer contain business rules.
- Build lifecycle logic lives in `BuildService`.
- Member approval logic lives in `MemberService`.
- Event lifecycle logic lives in `EventService`.
- Attendance check-in logic lives in `AttendanceService`.
- Push notification logic lives in `NotificationService`.
- Shared service errors are handled consistently.
- Business rules are testable without HTTP requests.
- No duplicate status transition logic remains.
