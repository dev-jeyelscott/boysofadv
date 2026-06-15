import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db/db";
import { eventAttendance, events, users } from "@/db/schema";
import { EVENT_STATUSES } from "@/lib/constants/event";
import { USER_STATUSES } from "@/lib/constants/user";
import {
  createAttendanceToken,
  verifyAttendanceToken,
} from "@/lib/attendance-token";
import { calculateDistanceMeters } from "@/lib/geo";
import { assertApprovedAdmin } from "@/src/features/shared/service-actor";
import { eventBus } from "@/src/lib/events/event-bus";
import { registerDomainEventHandlers } from "@/src/lib/events/handlers";
import { ServiceError } from "@/src/lib/errors/service-error";
import type {
  AttendanceCheckInInput,
  EventAttendanceInput,
  RemoveAttendanceInput,
} from "./attendance-types";
import {
  attendanceCheckInSchema,
  eventAttendanceSchema,
} from "./attendance-validation";

export const AttendanceService = {
  async createQrToken(input: EventAttendanceInput) {
    assertApprovedAdmin(input.actor);
    const { eventId } = eventAttendanceSchema.parse(input);

    const [event] = await db
      .select({
        id: events.id,
        status: events.status,
      })
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (!event) {
      throw new ServiceError("NOT_FOUND", "Event not found.");
    }

    if (event.status !== EVENT_STATUSES.PUBLISHED) {
      throw new ServiceError(
        "INVALID_STATE",
        "Attendance QR codes are only available for published events.",
      );
    }

    return {
      success: true,
      token: createAttendanceToken(event.id),
      expiresInSeconds: 30,
    };
  },

  async checkIn(input: AttendanceCheckInInput) {
    const payload = attendanceCheckInSchema.parse(input);

    const [member] = await db
      .select({
        id: users.id,
        status: users.status,
      })
      .from(users)
      .where(eq(users.id, payload.memberId))
      .limit(1);

    if (!member) {
      throw new ServiceError("NOT_FOUND", "Member not found.");
    }

    if (member.status !== USER_STATUSES.APPROVED) {
      throw new ServiceError(
        "FORBIDDEN",
        "Only approved members can check in.",
      );
    }

    const tokenPayload = verifyAttendanceToken(payload.token, payload.eventId);

    if (!tokenPayload) {
      throw new ServiceError(
        "VALIDATION_ERROR",
        "Invalid or expired QR code. Please scan the latest QR.",
      );
    }

    const [event] = await db
      .select({
        id: events.id,
        status: events.status,
        startsAt: events.startsAt,
        endsAt: events.endsAt,
        latitude: events.latitude,
        longitude: events.longitude,
        geoRadiusMeters: events.geoRadiusMeters,
      })
      .from(events)
      .where(eq(events.id, payload.eventId))
      .limit(1);

    if (!event) {
      throw new ServiceError("NOT_FOUND", "Event not found.");
    }

    if (event.status !== EVENT_STATUSES.PUBLISHED) {
      throw new ServiceError(
        "INVALID_STATE",
        "Attendance is not available for this event.",
      );
    }

    if (!event.endsAt) {
      throw new ServiceError(
        "INVALID_STATE",
        "Event schedule is not configured.",
      );
    }

    const now = new Date();

    if (now < event.startsAt || now > event.endsAt) {
      throw new ServiceError(
        "INVALID_STATE",
        "Attendance is currently closed.",
      );
    }

    if (!event.latitude || !event.longitude) {
      throw new ServiceError(
        "INVALID_STATE",
        "Event GPS location is not configured.",
      );
    }

    const eventLatitude = Number(event.latitude);
    const eventLongitude = Number(event.longitude);
    const geoRadiusMeters = Number(event.geoRadiusMeters ?? 80);

    const distanceMeters = calculateDistanceMeters({
      fromLatitude: payload.latitude,
      fromLongitude: payload.longitude,
      toLatitude: eventLatitude,
      toLongitude: eventLongitude,
    });

    if (distanceMeters > geoRadiusMeters) {
      throw new ServiceError(
        "FORBIDDEN",
        `You are too far from the event location. Distance: ${Math.round(
          distanceMeters,
        )}m. Allowed radius: ${geoRadiusMeters}m.`,
      );
    }

    const [attendance] = await db
      .insert(eventAttendance)
      .values({
        eventId: payload.eventId,
        userId: payload.memberId,
        status: "checked_in",
        checkInLatitude: payload.latitude.toString(),
        checkInLongitude: payload.longitude.toString(),
        gpsAccuracyMeters:
          typeof payload.gpsAccuracyMeters === "number"
            ? payload.gpsAccuracyMeters.toString()
            : null,
        distanceMeters: distanceMeters.toFixed(2),
      })
      .onConflictDoNothing({
        target: [eventAttendance.eventId, eventAttendance.userId],
      })
      .returning();

    if (!attendance) {
      throw new ServiceError("CONFLICT", "Member already checked in");
    }

    registerDomainEventHandlers();
    await eventBus.emit("attendance.checked_in", {
      actorId: attendance.userId,
      entityId: attendance.eventId,
      metadata: {
        eventId: attendance.eventId,
        memberId: attendance.userId,
        checkedInAt: attendance.checkedInAt,
        gpsAccuracyMeters: attendance.gpsAccuracyMeters,
        distanceMeters: attendance.distanceMeters,
      },
    });

    return {
      success: true,
      attendance: {
        eventId: attendance.eventId,
        memberId: attendance.userId,
        checkedInAt: attendance.checkedInAt,
        gpsAccuracyMeters: attendance.gpsAccuracyMeters,
        distanceMeters: attendance.distanceMeters,
      },
    };
  },

  async getEventAttendance(input: EventAttendanceInput) {
    assertApprovedAdmin(input.actor);
    const { eventId } = eventAttendanceSchema.parse(input);

    const rows = await db
      .select()
      .from(eventAttendance)
      .where(eq(eventAttendance.eventId, eventId))
      .orderBy(desc(eventAttendance.checkedInAt));

    return {
      success: true,
      attendance: rows,
    };
  },

  async removeAttendance(input: RemoveAttendanceInput) {
    assertApprovedAdmin(input.actor);
    const { eventId } = eventAttendanceSchema.parse(input);

    await db
      .delete(eventAttendance)
      .where(
        and(
          eq(eventAttendance.eventId, eventId),
          eq(eventAttendance.userId, input.memberId),
        ),
      );

    return {
      success: true,
    };
  },
};
