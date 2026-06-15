## Phase 5 — Event Bus Pattern Spec

### Goal

Decouple core application actions from side effects such as push notifications, audit logs, activity feeds, and future badges.

---

## Scope

Implement a simple internal event bus for domain events.

Create:

```txt
src/lib/events/event-bus.ts
src/lib/events/handlers/
```

---

## Domain Events

Supported events:

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

---

## Requirements

### Event Bus

Create a shared event bus helper that can:

```ts
emit(eventName, payload);
register(eventName, handler);
```

Rules:

- Event names must be typed.
- Payloads must be typed.
- Multiple handlers can listen to one event.
- Handlers run asynchronously.
- Core services should not directly call push, audit, badges, or feed logic.
- Failed handlers must not break the main action unless explicitly required.

---

## Event Payloads

Each event should include enough context for handlers:

```ts
type BaseEventPayload = {
  actorId?: string;
  entityId: string;
  metadata?: Record<string, unknown>;
};
```

Example:

```ts
eventBus.emit("build.published", {
  actorId: adminId,
  entityId: build.id,
  metadata: {
    buildTitle: build.title,
    ownerId: build.userId,
  },
});
```

---

## Handlers

Create handlers under:

```txt
src/lib/events/handlers/
```

Initial handlers:

```txt
audit-log-handler.ts
push-notification-handler.ts
```

Future handlers:

```txt
activity-feed-handler.ts
achievement-handler.ts
```

---

## Usage

Domain services emit events after successful business actions.

Example:

```ts
await approveMember(userId);

await eventBus.emit("member.approved", {
  actorId: adminId,
  entityId: userId,
});
```

The service should not know what happens after the event is emitted.

---

## Acceptance Criteria

- Event bus exists and supports typed events.
- Listed domain events are registered.
- Audit logging uses the event bus.
- Push notifications use the event bus.
- Services emit events instead of directly triggering side effects.
- Adding a new side effect does not require changing domain service logic.
- Handler failures are logged and isolated.
- Pattern is documented for future handlers.
