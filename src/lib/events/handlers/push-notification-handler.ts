import { NotificationService } from "@/src/features/notifications/notification-service";
import type {
  DomainEventName,
  DomainEventPayloads,
} from "@/src/lib/events/event-bus";

export async function pushNotificationHandler(
  eventName: DomainEventName,
  payload: DomainEventPayloads[DomainEventName],
) {
  switch (eventName) {
    case "member.approved": {
      await NotificationService.notifyUser({
        userId: payload.entityId,
        payload: {
          title: "Membership Approved",
          body: "Your membership application is approved.",
          url: "/my-profile",
        },
      });
      return;
    }

    case "build.published": {
      const metadata =
        payload.metadata as DomainEventPayloads["build.published"]["metadata"];
      await NotificationService.notifyBuildPublished({
        ownerId: metadata.ownerId,
        slug: metadata.slug,
      });
      return;
    }

    case "build.rejected": {
      const metadata =
        payload.metadata as DomainEventPayloads["build.rejected"]["metadata"];
      await NotificationService.notifyBuildRejected({
        ownerId: metadata.ownerId,
      });
      return;
    }

    case "event.created": {
      const metadata =
        payload.metadata as DomainEventPayloads["event.created"]["metadata"];
      if (metadata.notificationQueued) {
        await NotificationService.notifyEventCreated({
          eventId: payload.entityId,
          title: metadata.title,
        });
      }
      return;
    }

    case "event.updated": {
      const metadata =
        payload.metadata as DomainEventPayloads["event.updated"]["metadata"];
      if (metadata.notificationQueued) {
        await NotificationService.notifyEventUpdated({
          eventId: payload.entityId,
          title: metadata.title,
        });
      }
      return;
    }

    case "event.cancelled": {
      const metadata =
        payload.metadata as DomainEventPayloads["event.cancelled"]["metadata"];
      if (metadata.notificationQueued) {
        await NotificationService.notifyEventCancelled({
          eventId: payload.entityId,
          title: metadata.title,
        });
      }
      return;
    }

    case "build.submitted":
    case "attendance.checked_in":
      return;
  }
}
