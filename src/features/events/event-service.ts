import { randomUUID } from "crypto";
import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/db/db";
import { events } from "@/db/schema";
import { EVENT_STATUSES } from "@/lib/constants/event";
import { NotificationService } from "@/src/features/notifications/notification-service";
import { assertApprovedAdmin } from "@/src/features/shared/service-actor";
import { ServiceError } from "@/src/lib/errors/service-error";
import type {
  CancelEventInput,
  CreateEventInput,
  EventDataInput,
  EventTransitionInput,
  UpdateEventInput,
} from "./event-types";
import {
  cancelEventSchema,
  eventDataSchema,
  eventIdSchema,
} from "./event-validation";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function assertEventFound<T>(event: T | undefined) {
  if (!event) {
    throw new ServiceError("NOT_FOUND", "Event not found.");
  }

  return event;
}

function validateEventData(data: EventDataInput, allowPastStart = false) {
  const payload = eventDataSchema.parse(data);

  if (payload.startsAt >= payload.endsAt) {
    throw new ServiceError(
      "VALIDATION_ERROR",
      "Event start time must be before end time.",
    );
  }

  if (!allowPastStart && payload.startsAt < new Date()) {
    throw new ServiceError(
      "VALIDATION_ERROR",
      "Event cannot start in the past.",
    );
  }

  return payload;
}

function eventNotificationChanged(
  before: {
    startsAt: Date;
    endsAt: Date | null;
    location: string | null;
  },
  after: EventDataInput,
) {
  return (
    before.startsAt.getTime() !== after.startsAt.getTime() ||
    before.endsAt?.getTime() !== after.endsAt.getTime() ||
    before.location !== after.location
  );
}

export const EventService = {
  async create(input: CreateEventInput) {
    assertApprovedAdmin(input.actor);
    const payload = validateEventData(input.data, input.allowPastStart);
    const id = randomUUID();

    const [event] = await db
      .insert(events)
      .values({
        id,
        slug: `${createSlug(payload.title)}-${id.slice(0, 8)}`,
        title: payload.title,
        description: payload.description,
        location: payload.location,
        latitude: payload.latitude || null,
        longitude: payload.longitude || null,
        geoRadiusMeters: payload.geoRadiusMeters ?? 80,
        startsAt: payload.startsAt,
        endsAt: payload.endsAt,
        status: EVENT_STATUSES.DRAFT,
        posterImageUrl: payload.posterImageUrl || null,
        posterImageKey: payload.posterImageKey || null,
      })
      .returning();

    return {
      success: true,
      event,
    };
  },

  async update(input: UpdateEventInput) {
    assertApprovedAdmin(input.actor);
    eventIdSchema.parse(input.eventId);
    const payload = validateEventData(input.data, input.allowPastStart);

    const [currentEvent] = await db
      .select({
        id: events.id,
        title: events.title,
        status: events.status,
        startsAt: events.startsAt,
        endsAt: events.endsAt,
        location: events.location,
      })
      .from(events)
      .where(eq(events.id, input.eventId))
      .limit(1);

    assertEventFound(currentEvent);

    if (
      currentEvent.status === EVENT_STATUSES.CANCELLED ||
      currentEvent.status === EVENT_STATUSES.COMPLETED
    ) {
      throw new ServiceError(
        "INVALID_STATE",
        "Cancelled or completed events cannot be updated.",
      );
    }

    const shouldNotify =
      currentEvent.status === EVENT_STATUSES.PUBLISHED &&
      eventNotificationChanged(currentEvent, payload);

    const [event] = await db
      .update(events)
      .set({
        title: payload.title,
        description: payload.description,
        location: payload.location,
        latitude: payload.latitude || null,
        longitude: payload.longitude || null,
        geoRadiusMeters: payload.geoRadiusMeters ?? 80,
        startsAt: payload.startsAt,
        endsAt: payload.endsAt,
        posterImageUrl: payload.posterImageUrl || null,
        posterImageKey: payload.posterImageKey || null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(events.id, input.eventId),
          inArray(events.status, [
            EVENT_STATUSES.DRAFT,
            EVENT_STATUSES.PUBLISHED,
          ]),
        ),
      )
      .returning();

    assertEventFound(event);

    const notificationSummary = shouldNotify
      ? await NotificationService.notifyEventUpdated({
          eventId: event.id,
          title: event.title,
        })
      : undefined;

    return {
      success: true,
      event,
      notificationSummary,
    };
  },

  async publish(input: EventTransitionInput) {
    assertApprovedAdmin(input.actor);
    eventIdSchema.parse(input.eventId);

    const now = new Date();
    const [event] = await db
      .update(events)
      .set({
        status: EVENT_STATUSES.PUBLISHED,
        publishedAt: now,
        statusUpdatedBy: input.actor.id,
        updatedAt: now,
      })
      .where(
        and(
          eq(events.id, input.eventId),
          eq(events.status, EVENT_STATUSES.DRAFT),
        ),
      )
      .returning();

    if (!event) {
      const existing = await db.query.events.findFirst({
        where: eq(events.id, input.eventId),
      });

      assertEventFound(existing);
      throw new ServiceError(
        "INVALID_STATE",
        "Only draft events can be published.",
      );
    }

    const notificationSummary = await NotificationService.notifyEventCreated({
      eventId: event.id,
      title: event.title,
    });

    return {
      success: true,
      event,
      notificationSummary,
    };
  },

  async cancel(input: CancelEventInput) {
    assertApprovedAdmin(input.actor);
    const payload = cancelEventSchema.parse(input);

    const [currentEvent] = await db
      .select({ status: events.status })
      .from(events)
      .where(eq(events.id, payload.eventId))
      .limit(1);

    assertEventFound(currentEvent);

    const shouldNotify = currentEvent.status === EVENT_STATUSES.PUBLISHED;
    const now = new Date();
    const [event] = await db
      .update(events)
      .set({
        status: EVENT_STATUSES.CANCELLED,
        cancelledAt: now,
        cancelledBy: input.actor.id,
        cancellationReason: payload.reason,
        statusUpdatedBy: input.actor.id,
        updatedAt: now,
      })
      .where(
        and(
          eq(events.id, payload.eventId),
          inArray(events.status, [
            EVENT_STATUSES.DRAFT,
            EVENT_STATUSES.PUBLISHED,
          ]),
        ),
      )
      .returning();

    if (!event) {
      throw new ServiceError(
        "INVALID_STATE",
        "Only draft or published events can be cancelled.",
      );
    }

    const notificationSummary = shouldNotify
      ? await NotificationService.notifyEventCancelled({
          eventId: event.id,
          title: event.title,
        })
      : undefined;

    return {
      success: true,
      event,
      notificationSummary,
    };
  },

  async complete(input: EventTransitionInput) {
    assertApprovedAdmin(input.actor);
    eventIdSchema.parse(input.eventId);

    const now = new Date();
    const [event] = await db
      .update(events)
      .set({
        status: EVENT_STATUSES.COMPLETED,
        completedAt: now,
        statusUpdatedBy: input.actor.id,
        updatedAt: now,
      })
      .where(
        and(
          eq(events.id, input.eventId),
          eq(events.status, EVENT_STATUSES.PUBLISHED),
        ),
      )
      .returning();

    if (!event) {
      const existing = await db.query.events.findFirst({
        where: eq(events.id, input.eventId),
      });

      assertEventFound(existing);
      throw new ServiceError(
        "INVALID_STATE",
        "Only published events can be completed.",
      );
    }

    return {
      success: true,
      event,
    };
  },
};
