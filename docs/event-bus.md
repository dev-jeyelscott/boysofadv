# Event Bus

## Purpose

The internal event bus decouples primary domain state changes from secondary side effects such as audit logging and push notifications.

Services should complete the primary database change first, then emit a typed domain event for secondary work. This keeps Server Actions and API routes thin while giving common side effects one registration point.

## Location

- Event types and dispatch: `src/lib/events/event-bus.ts`
- Handler registration: `src/lib/events/handlers/index.ts`
- Audit handler: `src/lib/events/handlers/audit-log-handler.ts`
- Push handler: `src/lib/events/handlers/push-notification-handler.ts`

## Event Naming Convention

Events use the format:

```txt
domain.past_tense_action
```

Examples:

- `member.approved`
- `build.published`
- `event.cancelled`
- `attendance.checked_in`

## Payload Convention

All events extend a base shape:

```ts
{
  actorId?: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}
```

Rules:

- `entityId` is the primary entity affected by the event.
- `actorId` is the internal user id that initiated the action when there is one.
- `metadata` must contain only serializable operational context needed by handlers.
- Payload types are declared in `DomainEventPayloads`.

## Registered Handlers

`registerDomainEventHandlers()` registers two handlers for every current domain event:

- `auditLogHandler`
- `pushNotificationHandler`

Registration is idempotent through a module-level `registered` flag.

## Error Handling

`eventBus.emit()` runs handlers with `Promise.all`. Each handler is wrapped in a try/catch. Handler failure logs `[DOMAIN_EVENT_HANDLER_FAILED]` with event name, entity id, and error.

Handler failures are isolated. A failed notification or audit side effect must not undo the primary service action after the event has been emitted.

## Transaction Boundary Rules

Current services emit events after the primary database operation has completed. Handlers should not be used for invariants required by the main write.

Use service code for:

- Validation
- Authorization
- State transitions
- Required database writes

Use event handlers for:

- Audit logs
- Push notifications
- Other best-effort side effects

## Current Events

```ts
"member.approved";
"build.submitted";
"build.published";
"build.rejected";
"event.created";
"event.updated";
"event.cancelled";
"attendance.checked_in";
```

## Current Side Effects

| Event                   | Audit Log                | Push Notification                   |
| ----------------------- | ------------------------ | ----------------------------------- |
| `member.approved`       | Yes                      | Notify approved member              |
| `build.submitted`       | Yes                      | No                                  |
| `build.published`       | Yes                      | Notify build owner                  |
| `build.rejected`        | Yes                      | Notify build owner                  |
| `event.created`         | Yes                      | Notify approved members when queued |
| `event.updated`         | Yes                      | Notify approved members when queued |
| `event.cancelled`       | Yes                      | Notify approved members when queued |
| `attendance.checked_in` | No current audit mapping | No                                  |

When adding a new event, update `DomainEventPayloads`, register it in `DOMAIN_EVENTS`, and decide whether audit or push handlers need to map it.
