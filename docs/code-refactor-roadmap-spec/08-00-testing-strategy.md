# Phase 8 — Testing Strategy

## Goal

Make future refactors safe by adding automated tests around the most important Boys of ADV business flows.

This phase should protect:

- member approval
- build lifecycle
- event lifecycle
- QR attendance
- push notifications
- permissions
- status transitions
- geofence validation

---

# 1. Testing Stack

## Recommended Tools

Use the following:

```txt
Unit / Integration:
- Vitest
- Testing Library
- MSW if API/network mocking is needed

E2E:
- Playwright

Database:
- PostgreSQL test database
- Drizzle migrations applied before tests

CI:
- GitHub Actions
- Run tests before merge/deploy
```

---

# 2. Test Structure

Use this structure:

```txt
src/
  features/
    builds/
      __tests__/
    events/
      __tests__/
    members/
      __tests__/
    attendance/
      __tests__/
    notifications/
      __tests__/

tests/
  integration/
    member-approval.test.ts
    build-submission.test.ts
    build-publishing.test.ts
    event-creation.test.ts
    attendance-check-in.test.ts
    push-subscription.test.ts

  e2e/
    signup-pending-approval.spec.ts
    admin-approves-member.spec.ts
    member-creates-build.spec.ts
    admin-publishes-build.spec.ts
    public-build-appears.spec.ts
    event-check-in.spec.ts
```

---

# 3. Unit Tests

## 3.1 Status Transitions

Test all allowed and forbidden status changes.

### Member Status

```txt
for_approval → approved
for_approval → rejected
approved → suspended
suspended → approved
```

Reject invalid transitions such as:

```txt
rejected → approved
archived → approved
approved → for_approval
```

## 3.2 Build Status

Test:

```txt
draft → for_review
for_review → published
for_review → rejected
published → unpublished
unpublished → for_review
```

Reject:

```txt
draft → published
rejected → published
published → draft
archived → published
```

## 3.3 Permission Checks

Test permission helpers for:

```txt
super_admin
admin
member
guest
```

Required checks:

- only admins can approve members
- only admins can publish builds
- only approved members can submit builds
- suspended members cannot create builds
- guests cannot access member-only actions

## 3.4 Geofence Distance Calculation

Test the distance helper used by event check-in.

Scenarios:

- user is inside allowed radius
- user is outside allowed radius
- GPS coordinates are missing
- GPS accuracy is too weak
- event has no geofence configured

## 3.5 QR Token Validation

Test:

- valid token
- expired token
- malformed token
- token for wrong event
- reused token if reuse is not allowed
- token outside valid time window

## 3.6 Build Publishing Rules

Test that a build can only be published when:

- status is `for_review`
- owner exists
- owner is approved
- required build fields exist
- cover image exists if required
- build is not archived

Reject publish when:

- build is draft
- build is rejected
- owner is suspended
- required fields are missing

---

# 4. Integration Tests

Integration tests should hit real service functions and a real test database.

## 4.1 Member Approval

Test flow:

```txt
Create user with status for_approval
Admin approves member
User status becomes approved
Audit log is created
Push notification is queued/sent if enabled
```

Validate:

- DB user status updated
- audit log exists
- invalid actor cannot approve
- approving already approved member fails safely

## 4.2 Build Submission

Test flow:

```txt
Approved member creates draft build
Member submits build
Build status becomes for_review
Admins receive notification
Audit log is created
```

Validate:

- only owner can submit own build
- suspended user cannot submit
- missing required fields fail validation

## 4.3 Build Publishing

Test flow:

```txt
Build is for_review
Admin publishes build
Build status becomes published
Build becomes visible publicly
Owner receives notification
Audit log is created
```

Validate:

- member cannot publish
- draft cannot be published directly
- rejected build cannot be published directly

## 4.4 Event Creation

Test flow:

```txt
Admin creates event
Event is saved as draft or published
Audit log is created
Push notification is sent if published
```

Validate:

- required fields are enforced
- startsAt must be before endsAt
- member cannot create event
- invalid location/geofence data is rejected

## 4.5 Attendance Check-In

Test flow:

```txt
Published event is active
Member scans QR token
Location is inside geofence
Attendance record is created
```

Validate:

- duplicate check-in is blocked
- expired token is rejected
- outside geofence is rejected
- cancelled event rejects check-in
- non-approved member rejects check-in

## 4.6 Push Subscription Save/Remove

Test save flow:

```txt
Approved member enables push notifications
Subscription is saved
Duplicate endpoint updates existing subscription
```

Test remove flow:

```txt
Member disables push notifications
Subscription is removed
```

Validate:

- subscription belongs to user
- invalid payload fails validation
- suspended users cannot save new subscriptions if restricted

---

# 5. E2E Tests

E2E tests should use Playwright and cover real user flows.

## 5.1 Signup Pending Approval Flow

Scenario:

```txt
User signs up with Clerk
User is redirected to pending approval page
User cannot access member dashboard
```

Validate:

- pending approval screen appears
- protected routes redirect correctly
- no admin-only pages are accessible

## 5.2 Admin Approves Member

Scenario:

```txt
Admin logs in
Admin opens membership approvals
Admin approves pending member
Member status changes to approved
```

Validate:

- approved member disappears from pending list
- approved member appears in members list
- success toast appears

## 5.3 Member Creates Build

Scenario:

```txt
Approved member logs in
Member opens My Build
Member fills build form
Member saves draft
Member submits for review
```

Validate:

- build draft is saved
- form validation works
- status becomes for_review
- success message appears

## 5.4 Admin Publishes Build

Scenario:

```txt
Admin opens builds review page
Admin reviews submitted build
Admin publishes build
```

Validate:

- build status becomes published
- publish action is no longer available
- audit trail or activity entry exists if visible

## 5.5 Public Build Appears

Scenario:

```txt
Visitor opens public Builds page
Published build appears in list
Visitor opens build detail page
```

Validate:

- unpublished builds do not appear
- published build is searchable
- owner nickname/codename displays correctly

## 5.6 Event Check-In Flow

Scenario:

```txt
Approved member opens active event check-in page
QR token is valid
Browser location is mocked inside geofence
Member checks in successfully
```

Validate:

- attendance record is created
- duplicate check-in is blocked
- outside geofence state shows error

---

# 6. Test Data and Fixtures

Create reusable factories:

```txt
createTestUser()
createApprovedMember()
createPendingMember()
createAdmin()
createSuperAdmin()
createBuild()
createSubmittedBuild()
createPublishedBuild()
createEvent()
createPublishedEvent()
createActiveEvent()
createPushSubscription()
```

Recommended location:

```txt
tests/factories/
  users.ts
  builds.ts
  events.ts
  attendance.ts
  push-subscriptions.ts
```

---

# 7. Mocking Rules

Mock only external services.

## Mock These

```txt
Clerk auth
Web Push sending
UploadThing
Browser geolocation
QR token time
Email if added later
```

## Do Not Mock These in Integration Tests

```txt
Drizzle queries
status transition services
permission helpers
business rules
database constraints
```

---

# 8. Database Testing Rules

Use a separate test database.

```txt
DATABASE_URL=postgres://.../boysofadv_test
```

Before tests:

```txt
drizzle-kit push
or
drizzle-kit migrate
```

After each test:

```txt
truncate test tables
reset sequences if needed
```

Recommended cleanup order:

```txt
event_attendance
push_subscriptions
audit_logs
gallery_images
builds
events
partners
users
```

---

# 9. CI Requirements

Add GitHub Actions workflow:

```txt
On pull request:
- install dependencies
- run typecheck
- run lint
- run unit tests
- run integration tests
- run Playwright E2E tests

On main branch:
- run full test suite before deploy
```

Required commands:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm test:e2e
```

---

# 10. Package Scripts

Add scripts:

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run src",
    "test:integration": "vitest run tests/integration",
    "test:e2e": "playwright test",
    "test:coverage": "vitest run --coverage",
    "typecheck": "tsc --noEmit"
  }
}
```

---

# 11. Coverage Targets

Minimum targets:

```txt
Unit tests: 80%
Domain services: 90%
Permission helpers: 95%
Status transition logic: 100%
Geofence / QR helpers: 100%
E2E: critical flows only
```

Do not chase full UI coverage. Prioritize business rules and risky flows.

---

# 12. Acceptance Criteria

Phase 8 is complete when:

- unit tests exist for status, permissions, geofence, QR token, and publishing rules
- integration tests cover member, build, event, attendance, and push flows
- Playwright E2E tests cover the main user journey
- test database is isolated from production
- external services are mocked safely
- CI blocks failed tests before merge
- refactors can be made with confidence without manually retesting every flow
