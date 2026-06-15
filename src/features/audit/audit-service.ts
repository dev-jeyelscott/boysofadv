import { db } from "@/db/db";
import { auditLogs } from "@/db/schema";

export const AUDIT_LOG_ACTIONS = [
  "Member Approved",
  "Member Rejected",
  "Member Suspended",
  "Build Submitted",
  "Build Published",
  "Build Rejected",
  "Event Created",
  "Event Updated",
  "Event Cancelled",
  "Partner Updated",
] as const;

export const AUDIT_LOG_ENTITY_TYPES = [
  "member",
  "build",
  "event",
  "partner",
] as const;

export const AUDIT_ACTIONS = {
  MEMBER_APPROVED: "Member Approved",
  MEMBER_REJECTED: "Member Rejected",
  MEMBER_SUSPENDED: "Member Suspended",
  BUILD_SUBMITTED: "Build Submitted",
  BUILD_PUBLISHED: "Build Published",
  BUILD_REJECTED: "Build Rejected",
  EVENT_CREATED: "Event Created",
  EVENT_UPDATED: "Event Updated",
  EVENT_CANCELLED: "Event Cancelled",
  PARTNER_UPDATED: "Partner Updated",
} as const;

export const AUDIT_ENTITY_TYPES = {
  MEMBER: "member",
  BUILD: "build",
  EVENT: "event",
  PARTNER: "partner",
} as const;

export type AuditLogAction = (typeof AUDIT_LOG_ACTIONS)[number];
export type AuditLogEntityType = (typeof AUDIT_LOG_ENTITY_TYPES)[number];

type AuditLogMetadata = Record<string, unknown> | unknown[] | null;

export type CreateAuditLogInput = {
  actorId: string;
  action: AuditLogAction;
  entityType: AuditLogEntityType;
  entityId: string;
  metadata?: AuditLogMetadata;
};

export async function createAuditLog(input: CreateAuditLogInput) {
  try {
    await db.insert(auditLogs).values({
      actorId: input.actorId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata: input.metadata ?? null,
    });
  } catch (error) {
    console.error("[AUDIT_LOG_CREATE_FAILED]", error);
  }
}
