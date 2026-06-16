import { eventBus, type DomainEventName } from "@/src/lib/events/event-bus";
import { auditLogHandler } from "./audit-log-handler";
import { pushNotificationHandler } from "./push-notification-handler";

const DOMAIN_EVENTS = [
  "member.approved",
  "build.submitted",
  "build.published",
  "build.rejected",
  "event.created",
  "event.updated",
  "event.cancelled",
  "attendance.checked_in",
] as const satisfies readonly DomainEventName[];

let registered = false;

export function registerDomainEventHandlers() {
  if (registered) {
    return;
  }

  for (const eventName of DOMAIN_EVENTS) {
    eventBus.register(eventName, (payload) =>
      auditLogHandler(eventName, payload),
    );
    eventBus.register(eventName, (payload) =>
      pushNotificationHandler(eventName, payload),
    );
  }

  registered = true;
}
