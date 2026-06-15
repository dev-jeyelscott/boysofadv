# Phase 1 — Stabilize the Foundation

## Goal

Make the Boys of ADV codebase easier to maintain, safer to extend, and more consistent before adding advanced architecture patterns such as feature modules, service layers, domain actions, background jobs, and stronger testing.

This phase focuses on **organization, naming consistency, reusable logic, validation, constants, and status handling**.

---

## 1. Target Folder Structure

```txt
src/
  app/
    (public)/
    (member)/
    admin/
    api/

  components/
    ui/
    shared/
    layout/
    forms/

  db/
    db.ts
    schema.ts
    relations.ts
    queries/

  features/
    builds/
      components/
      actions/
      queries/
      validators/
      constants/
      types.ts
      utils.ts

    events/
      components/
      actions/
      queries/
      validators/
      constants/
      types.ts
      utils.ts

    members/
      components/
      actions/
      queries/
      validators/
      constants/
      types.ts
      utils.ts

    partners/
      components/
      actions/
      queries/
      validators/
      constants/
      types.ts
      utils.ts

    notifications/
      actions/
      queries/
      types.ts
      utils.ts

    attendance/
      actions/
      queries/
      validators/
      constants/
      types.ts
      utils.ts

  lib/
    auth/
      require-auth.ts
      require-admin.ts
      require-approved-user.ts

    permissions/
      build-permissions.ts
      event-permissions.ts
      member-permissions.ts

    validators/
      common.ts

    constants/
      app.ts
      routes.ts
      roles.ts
      statuses.ts

    utils/
      date.ts
      format.ts
      slug.ts
      pagination.ts
      response.ts
```

---

## 2. Refactor Rules

### 2.1 `app/` Should Stay Thin

#### Rule

Files inside `src/app` should mainly handle:

- routing
- layout composition
- calling feature-level components
- calling server actions or API handlers
- metadata

#### Avoid

Do not place business logic directly inside pages, layouts, or route handlers.

#### Example

Instead of:

```ts
// app/admin/events/page.tsx
const events = await db.select().from(eventsTable);
const formatted = events.map(...);
```

Use:

```ts
// app/admin/events/page.tsx
import { getAdminEvents } from "@/features/events/queries/get-admin-events";

const events = await getAdminEvents();
```

---

## 3. Standard Naming Convention

### 3.1 Date Fields

Current issue:

```ts
startDate;
endDate;
startsAt;
endsAt;
```

#### Standard

Use:

```ts
startsAt;
endsAt;
```

#### Applies To

- database schema
- Drizzle queries
- TypeScript types
- API responses
- forms
- event cards
- admin event tables
- attendance logic
- cron jobs

#### Refactor Checklist

Replace:

```ts
startDate -> startsAt
endDate -> endsAt
```

Avoid keeping both names unless there is a temporary migration adapter.

---

## 4. Centralized Constants

### 4.1 Roles

Create:

```ts
// src/lib/constants/roles.ts

export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MEMBER: "member",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
```

---

### 4.2 User Statuses

```ts
// src/lib/constants/statuses.ts

export const USER_STATUSES = {
  FOR_APPROVAL: "for_approval",
  APPROVED: "approved",
  REJECTED: "rejected",
  SUSPENDED: "suspended",
  ARCHIVED: "archived",
} as const;

export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES];
```

---

### 4.3 Build Statuses

```ts
export const BUILD_STATUSES = {
  DRAFT: "draft",
  FOR_REVIEW: "for_review",
  PUBLISHED: "published",
  REJECTED: "rejected",
  UNPUBLISHED: "unpublished",
  ARCHIVED: "archived",
} as const;

export type BuildStatus = (typeof BUILD_STATUSES)[keyof typeof BUILD_STATUSES];
```

---

### 4.4 Event Statuses

```ts
export const EVENT_STATUSES = {
  DRAFT: "draft",
  PUBLISHED: "published",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const EVENT_DISPLAY_STATUSES = {
  DRAFT: "draft",
  UPCOMING: "upcoming",
  ONGOING: "ongoing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type EventStatus = (typeof EVENT_STATUSES)[keyof typeof EVENT_STATUSES];

export type EventDisplayStatus =
  (typeof EVENT_DISPLAY_STATUSES)[keyof typeof EVENT_DISPLAY_STATUSES];
```

---

## 5. Centralized Status Logic

### 5.1 Event Display Status

Create:

```ts
// src/features/events/utils/get-event-display-status.ts

import {
  EVENT_DISPLAY_STATUSES,
  EVENT_STATUSES,
  type EventDisplayStatus,
  type EventStatus,
} from "@/lib/constants/statuses";

type EventStatusInput = {
  status: EventStatus;
  startsAt: Date | string;
  endsAt: Date | string;
};

export function getEventDisplayStatus(
  event: EventStatusInput,
  now = new Date(),
): EventDisplayStatus {
  const startsAt = new Date(event.startsAt);
  const endsAt = new Date(event.endsAt);

  if (event.status === EVENT_STATUSES.DRAFT) {
    return EVENT_DISPLAY_STATUSES.DRAFT;
  }

  if (event.status === EVENT_STATUSES.CANCELLED) {
    return EVENT_DISPLAY_STATUSES.CANCELLED;
  }

  if (event.status === EVENT_STATUSES.COMPLETED) {
    return EVENT_DISPLAY_STATUSES.COMPLETED;
  }

  if (event.status === EVENT_STATUSES.PUBLISHED) {
    if (startsAt > now) return EVENT_DISPLAY_STATUSES.UPCOMING;
    if (startsAt <= now && endsAt >= now) return EVENT_DISPLAY_STATUSES.ONGOING;
    return EVENT_DISPLAY_STATUSES.COMPLETED;
  }

  return EVENT_DISPLAY_STATUSES.DRAFT;
}
```

Use this everywhere:

- public event cards
- admin event table
- event details page
- check-in gate
- cron status update
- attendance validation

---

### 5.2 Build Action Rules

Create:

```ts
// src/features/builds/utils/get-build-actions.ts

import { BUILD_STATUSES } from "@/lib/constants/statuses";

type BuildActionInput = {
  status: string;
  isOwner: boolean;
  isAdmin: boolean;
};

export function getBuildActions(input: BuildActionInput) {
  const { status, isOwner, isAdmin } = input;

  return {
    canEdit:
      isOwner &&
      [
        BUILD_STATUSES.DRAFT,
        BUILD_STATUSES.REJECTED,
        BUILD_STATUSES.UNPUBLISHED,
      ].includes(status as any),

    canSubmitForReview:
      isOwner &&
      [
        BUILD_STATUSES.DRAFT,
        BUILD_STATUSES.REJECTED,
        BUILD_STATUSES.UNPUBLISHED,
      ].includes(status as any),

    canUnpublish: isOwner && status === BUILD_STATUSES.PUBLISHED,

    canPublish: isAdmin && status === BUILD_STATUSES.FOR_REVIEW,

    canReject: isAdmin && status === BUILD_STATUSES.FOR_REVIEW,

    canArchive: isAdmin && status !== BUILD_STATUSES.ARCHIVED,
  };
}
```

---

## 6. Shared Validation Schemas

### 6.1 Common Validators

```ts
// src/lib/validators/common.ts

import { z } from "zod";

export const idSchema = z.string().min(1);

export const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const optionalUrlSchema = z.string().url().optional().or(z.literal(""));

export const requiredStringSchema = z.string().trim().min(1);

export const optionalStringSchema = z.string().trim().optional();
```

---

### 6.2 Event Validator

```ts
// src/features/events/validators/event.schema.ts

import { z } from "zod";

export const eventFormSchema = z
  .object({
    title: z.string().trim().min(1),
    description: z.string().trim().optional(),
    location: z.string().trim().optional(),
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date(),
    posterImage: z.string().url().optional().or(z.literal("")),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    geoRadiusMeters: z.coerce.number().min(10).optional(),
  })
  .refine((data) => data.endsAt > data.startsAt, {
    message: "End date must be after start date.",
    path: ["endsAt"],
  });

export type EventFormInput = z.infer<typeof eventFormSchema>;
```

---

### 6.3 Build Validator

```ts
// src/features/builds/validators/build.schema.ts

import { z } from "zod";

export const buildFormSchema = z.object({
  title: z.string().trim().min(1),
  motorcycleModel: z.string().trim().min(1),
  yearModel: z.string().trim().optional(),
  concept: z.string().trim().optional(),
  description: z.string().trim().optional(),

  engineSetup: z.string().trim().optional(),
  cvtSetup: z.string().trim().optional(),
  suspensionSetup: z.string().trim().optional(),
  brakingSetup: z.string().trim().optional(),
  wheelSetup: z.string().trim().optional(),
  accessories: z.string().trim().optional(),

  coverImage: z.string().url().optional().or(z.literal("")),
  galleryImages: z.array(z.string().url()).default([]),
});

export type BuildFormInput = z.infer<typeof buildFormSchema>;
```

---

## 7. Query Layer

### Goal

Move database reads out of pages and components.

#### Example Structure

```txt
features/
  events/
    queries/
      get-public-events.ts
      get-admin-events.ts
      get-event-by-id.ts
      get-upcoming-events.ts
```

#### Example

```ts
// src/features/events/queries/get-public-events.ts

import { db } from "@/db/db";
import { events } from "@/db/schema";
import { and, eq, desc } from "drizzle-orm";
import { EVENT_STATUSES } from "@/lib/constants/statuses";

export async function getPublicEvents() {
  return db
    .select()
    .from(events)
    .where(eq(events.status, EVENT_STATUSES.PUBLISHED))
    .orderBy(desc(events.startsAt));
}
```

---

## 8. Action Layer

### Goal

Move mutations into predictable feature-level action files.

#### Example Structure

```txt
features/
  builds/
    actions/
      create-build.ts
      update-build.ts
      submit-build-for-review.ts
      publish-build.ts
      reject-build.ts
      unpublish-build.ts
```

#### Example

```ts
// src/features/builds/actions/submit-build-for-review.ts

"use server";

import { db } from "@/db/db";
import { builds } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BUILD_STATUSES } from "@/lib/constants/statuses";
import { requireApprovedUser } from "@/lib/auth/require-approved-user";

export async function submitBuildForReview(buildId: string) {
  const user = await requireApprovedUser();

  await db
    .update(builds)
    .set({
      status: BUILD_STATUSES.FOR_REVIEW,
      updatedAt: new Date(),
    })
    .where(eq(builds.id, buildId));

  return {
    success: true,
  };
}
```

---

## 9. Auth Helpers

### 9.1 Required User

```ts
// src/lib/auth/require-auth.ts

import { auth } from "@clerk/nextjs/server";

export async function requireAuth() {
  const result = await auth();

  if (!result.userId) {
    throw new Error("Unauthorized");
  }

  return result;
}
```

---

### 9.2 Required Admin

```ts
// src/lib/auth/require-admin.ts

import { requireAuth } from "./require-auth";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { USER_ROLES } from "@/lib/constants/roles";

export async function requireAdmin() {
  const authResult = await requireAuth();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, authResult.userId));

  if (
    !user ||
    ![USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(user.role as any)
  ) {
    throw new Error("Forbidden");
  }

  return user;
}
```

---

## 10. Permission Layer

### Goal

Avoid scattered permission checks.

#### Example

```ts
// src/lib/permissions/build-permissions.ts

import { USER_ROLES } from "@/lib/constants/roles";

type UserInput = {
  id: string;
  role: string;
};

type BuildInput = {
  ownerId: string;
  status: string;
};

export function canManageBuild(user: UserInput, build: BuildInput) {
  return (
    user.role === USER_ROLES.ADMIN ||
    user.role === USER_ROLES.SUPER_ADMIN ||
    user.id === build.ownerId
  );
}

export function canPublishBuild(user: UserInput) {
  return user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPER_ADMIN;
}
```

---

## 11. Migration Plan

### Step 1 — Create Folders

Create the new folders first without moving logic.

```txt
features/
lib/auth/
lib/permissions/
lib/validators/
lib/constants/
lib/utils/
```

---

### Step 2 — Move Constants

Move hardcoded values into:

```txt
src/lib/constants/
```

Priority:

1. roles
2. user statuses
3. build statuses
4. event statuses
5. routes
6. pagination limits
7. upload limits

---

### Step 3 — Fix Event Naming

Standardize all event date fields to:

```ts
startsAt;
endsAt;
```

Update:

- Drizzle schema
- event forms
- event admin table
- event public cards
- event details page
- attendance check-in
- cron routes
- seed data, if any

---

### Step 4 — Extract Status Utilities

Move repeated logic into:

```txt
features/events/utils/get-event-display-status.ts
features/builds/utils/get-build-actions.ts
features/members/utils/get-member-display-status.ts
```

---

### Step 5 — Extract Validators

Move all Zod schemas into:

```txt
features/*/validators/
```

Shared validators go into:

```txt
lib/validators/
```

---

### Step 6 — Extract Queries

Move repeated Drizzle reads into:

```txt
features/*/queries/
```

Examples:

```txt
get-admin-builds.ts
get-public-builds.ts
get-build-by-id.ts
get-featured-builds.ts
get-admin-events.ts
get-public-events.ts
get-member-profile.ts
```

---

### Step 7 — Extract Actions

Move mutations into:

```txt
features/*/actions/
```

Examples:

```txt
approve-member.ts
suspend-member.ts
publish-build.ts
reject-build.ts
create-event.ts
update-event.ts
delete-partner.ts
```

---

## 12. Acceptance Criteria

Phase 1 is complete when:

- `app/` files are thin and mostly compose feature modules.
- No duplicated event display status logic exists.
- Event date fields consistently use `startsAt` and `endsAt`.
- Roles and statuses are imported from centralized constants.
- Forms use shared Zod validators.
- Repeated database queries are moved into feature query files.
- Mutations are moved into feature action files.
- Permission checks are centralized.
- No feature directly imports unrelated feature internals unless necessary.
- Existing behavior remains unchanged.
- TypeScript passes without `any` except temporary migration boundaries.
- Lint/build passes successfully.
