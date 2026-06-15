import {
  AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
  createAuditLog,
  type AuditLogAction,
  type AuditLogEntityType,
} from "@/src/features/audit/audit-service";
import type {
  DomainEventName,
  DomainEventPayloads,
} from "@/src/lib/events/event-bus";

const AUDIT_EVENT_MAP = {
  "member.approved": {
    action: AUDIT_ACTIONS.MEMBER_APPROVED,
    entityType: AUDIT_ENTITY_TYPES.MEMBER,
  },
  "build.submitted": {
    action: AUDIT_ACTIONS.BUILD_SUBMITTED,
    entityType: AUDIT_ENTITY_TYPES.BUILD,
  },
  "build.published": {
    action: AUDIT_ACTIONS.BUILD_PUBLISHED,
    entityType: AUDIT_ENTITY_TYPES.BUILD,
  },
  "build.rejected": {
    action: AUDIT_ACTIONS.BUILD_REJECTED,
    entityType: AUDIT_ENTITY_TYPES.BUILD,
  },
  "event.created": {
    action: AUDIT_ACTIONS.EVENT_CREATED,
    entityType: AUDIT_ENTITY_TYPES.EVENT,
  },
  "event.updated": {
    action: AUDIT_ACTIONS.EVENT_UPDATED,
    entityType: AUDIT_ENTITY_TYPES.EVENT,
  },
  "event.cancelled": {
    action: AUDIT_ACTIONS.EVENT_CANCELLED,
    entityType: AUDIT_ENTITY_TYPES.EVENT,
  },
} as const satisfies Partial<
  Record<
    DomainEventName,
    {
      action: AuditLogAction;
      entityType: AuditLogEntityType;
    }
  >
>;

export async function auditLogHandler<TEventName extends DomainEventName>(
  eventName: TEventName,
  payload: DomainEventPayloads[TEventName],
) {
  const auditEvent = AUDIT_EVENT_MAP[eventName as keyof typeof AUDIT_EVENT_MAP];

  if (!auditEvent || !payload.actorId) {
    return;
  }

  await createAuditLog({
    actorId: payload.actorId,
    action: auditEvent.action,
    entityType: auditEvent.entityType,
    entityId: payload.entityId,
    metadata: payload.metadata ?? null,
  });
}
