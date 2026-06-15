# Phase 4 - Audit Logging

## Goal

Track important actions performed by admins and members for accountability, troubleshooting, and activity history.

---

## Requirements

### Create Audit Log Table

Table: `audit_logs`

Fields:

- `id`
- `actorId`
- `action`
- `entityType`
- `entityId`
- `metadata`
- `createdAt`

---

### Actions To Track

Use the shared `AUDIT_ACTIONS` constants for action names and `AUDIT_ENTITY_TYPES` constants for entity types.

#### Member Management

- `AUDIT_ACTIONS.MEMBER_APPROVED` (`Member Approved`)
- `AUDIT_ACTIONS.MEMBER_REJECTED` (`Member Rejected`)
- `AUDIT_ACTIONS.MEMBER_SUSPENDED` (`Member Suspended`)

Metadata:

```ts
{
  previousStatus: "for_approval" | "approved";
  newStatus: "approved" | "rejected" | "suspended";
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  suspendedBy?: string;
  suspendedAt?: Date;
  reason?: string | null;
}
```

#### Build Management

- `AUDIT_ACTIONS.BUILD_SUBMITTED` (`Build Submitted`)
- `AUDIT_ACTIONS.BUILD_PUBLISHED` (`Build Published`)
- `AUDIT_ACTIONS.BUILD_REJECTED` (`Build Rejected`)

Metadata:

```ts
{
  previousStatus: "draft" | "rejected" | "unpublished" | "for_review";
  newStatus: "for_review" | "published" | "rejected";
  ownerId: string;
  slug: string;
  submittedBy?: string;
  submittedAt?: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  publishedAt?: Date;
  reason?: string;
}
```

#### Event Management

- `AUDIT_ACTIONS.EVENT_CREATED` (`Event Created`)
- `AUDIT_ACTIONS.EVENT_UPDATED` (`Event Updated`)
- `AUDIT_ACTIONS.EVENT_CANCELLED` (`Event Cancelled`)

Metadata:

```ts
type EventAuditSnapshot = {
  title: string;
  status: string;
  startsAt: string | null;
  endsAt: string | null;
  location: string | null;
};

type EventCreatedMetadata = EventAuditSnapshot & {
  slug: string;
};

type EventUpdatedMetadata = {
  before: EventAuditSnapshot;
  after: EventAuditSnapshot;
  notificationQueued: boolean;
};

type EventCancelledMetadata = {
  title: string;
  previousStatus: string;
  status: string;
  reason: string;
  cancelledAt: string | null;
  notificationQueued: boolean;
};
```

#### Partner Management

- `AUDIT_ACTIONS.PARTNER_UPDATED` (`Partner Updated`)

Metadata:

```ts
type PartnerAuditSnapshot = {
  name: string;
  category: string | null;
  websiteUrl: string | null;
  description: string | null;
  status: "draft" | "active" | "inactive";
  logoUrl: string | null;
  logoKey: string | null;
};

type PartnerUpdatedMetadata = {
  before: PartnerAuditSnapshot;
  after: PartnerAuditSnapshot;
  changedFields: Array<
    | "name"
    | "category"
    | "websiteUrl"
    | "description"
    | "status"
    | "logoUrl"
    | "logoKey"
  >;
  logoChanged: boolean;
};
```

---

### Audit Log Helper

Create a shared helper:

```ts
createAuditLog({
  actorId,
  action,
  entityType,
  entityId,
  metadata,
});
```

Responsibilities:

- Insert records into `audit_logs`
- Accept structured metadata
- Reusable across services and API routes
- Fail safely without breaking primary business operations

---

## Architecture Rules

- Business services create audit logs after successful operations.
- API routes and Server Actions should not write audit logs directly.
- Audit logging must be centralized through the helper.
- Audit logs are append-only and never updated.
- Metadata should store relevant context for future investigation.

---

## Deliverables

- `audit_logs` database table
- Shared `createAuditLog()` helper
- Audit logging integrated into member, build, event, and partner workflows
- Consistent action naming across the application
- Documentation of tracked actions and metadata structure
