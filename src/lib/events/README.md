# Domain Event Bus

Domain services emit typed events after successful business actions. Side effects
such as audit logs, push notifications, activity feeds, and achievements belong
in handlers under `src/lib/events/handlers`.

To add a side effect, register a new handler in `handlers/index.ts`. Do not add
push, audit, badge, or feed logic directly to domain services.

Handler failures are logged by the event bus and isolated from the main action.
