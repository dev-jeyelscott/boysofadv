"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

import { db } from "@/db/db";
import { events } from "@/db/schema";
import { type EventStatus, isEventStatus } from "@/lib/constants/event";
import { sendPushNotificationToAllApprovedUsers } from "@/lib/send-push-notification";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getEventNotificationPayload(params: {
  eventId: string;
  title: string;
  status: EventStatus;
  action: "created" | "updated";
}) {
  const { eventId, title, status, action } = params;

  if (status === "draft") return null;

  if (status === "published") {
    return {
      title: action === "created" ? "New Event Published" : "Event Published",
      body: title,
      url: `/events/${eventId}`,
    };
  }

  if (status === "cancelled") {
    return {
      title: "Event Cancelled",
      body: title,
      url: `/events/${eventId}`,
    };
  }

  return {
    title: "Event Status Updated",
    body: `${title} is now ${status}.`,
    url: `/events/${eventId}`,
  };
}

async function sendEventStatusPushNotification(params: {
  eventId: string;
  title: string;
  status: EventStatus;
  action: "created" | "updated";
}) {
  const payload = getEventNotificationPayload(params);

  if (!payload) return;

  await sendPushNotificationToAllApprovedUsers(payload);
}

export type EventActionState = {
  success: boolean;
  message: string;
};

export async function createEventAction(
  formData: FormData,
): Promise<EventActionState> {
  try {
    const title = getString(formData, "title");
    const description = getString(formData, "description");
    const location = getString(formData, "location");
    const latitude = getString(formData, "latitude");
    const longitude = getString(formData, "longitude");
    const geoRadiusMeters = getString(formData, "geoRadiusMeters");
    const startsAt = getString(formData, "startsAt");
    const endsAt = getString(formData, "endsAt");
    const statusValue = getString(formData, "status");
    const posterImageUrl = getString(formData, "posterImageUrl");
    const posterImageKey = getString(formData, "posterImageKey");

    const status: EventStatus = isEventStatus(statusValue)
      ? statusValue
      : "draft";

    if (!title || !startsAt) {
      throw new Error("Missing required event fields.");
    }

    const id = randomUUID();

    const latitudeValue = latitude || null;
    const longitudeValue = longitude || null;
    const geoRadiusMetersValue = geoRadiusMeters ? Number(geoRadiusMeters) : 80;

    await db.insert(events).values({
      id,
      slug: `${createSlug(title)}-${id.slice(0, 8)}`,
      title,
      description: description || null,
      location: location || null,
      latitude: latitudeValue,
      longitude: longitudeValue,
      geoRadiusMeters: geoRadiusMetersValue,
      startsAt: new Date(startsAt),
      endsAt: endsAt ? new Date(endsAt) : null,
      status,
      posterImageUrl: posterImageUrl || null,
      posterImageKey: posterImageKey || null,
    });

    await sendEventStatusPushNotification({
      eventId: id,
      title,
      status,
      action: "created",
    });

    revalidatePath("/admin/events");

    return {
      success: true,
      message: "Event successfully created.",
    };
  } catch {
    return {
      success: false,
      message: "Failed to create event. Please try again.",
    };
  }
}

export async function updateEventAction(
  formData: FormData,
): Promise<EventActionState> {
  try {
    const id = getString(formData, "id");
    const title = getString(formData, "title");
    const description = getString(formData, "description");
    const location = getString(formData, "location");
    const latitude = getString(formData, "latitude");
    const longitude = getString(formData, "longitude");
    const geoRadiusMeters = getString(formData, "geoRadiusMeters");
    const startsAt = getString(formData, "startsAt");
    const endsAt = getString(formData, "endsAt");
    const statusValue = getString(formData, "status");
    const posterImageUrl = getString(formData, "posterImageUrl");
    const posterImageKey = getString(formData, "posterImageKey");

    const status: EventStatus = isEventStatus(statusValue)
      ? statusValue
      : "draft";

    if (!id || !title || !startsAt) {
      throw new Error("Missing required event fields.");
    }

    const [currentEvent] = await db
      .select({
        status: events.status,
      })
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    if (!currentEvent) {
      throw new Error("Event not found.");
    }

    const latitudeValue = latitude || null;
    const longitudeValue = longitude || null;
    const geoRadiusMetersValue = geoRadiusMeters ? Number(geoRadiusMeters) : 80;

    await db
      .update(events)
      .set({
        title,
        description: description || null,
        location: location || null,
        latitude: latitudeValue,
        longitude: longitudeValue,
        geoRadiusMeters: geoRadiusMetersValue,
        startsAt: new Date(startsAt),
        endsAt: endsAt ? new Date(endsAt) : null,
        status,
        posterImageUrl: posterImageUrl || null,
        posterImageKey: posterImageKey || null,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id));

    if (currentEvent.status !== status) {
      await sendEventStatusPushNotification({
        eventId: id,
        title,
        status,
        action: "updated",
      });
    }

    revalidatePath("/admin/events");

    return {
      success: true,
      message: "Event successfully updated.",
    };
  } catch {
    return {
      success: false,
      message: "Failed to update event. Please try again.",
    };
  }
}

export async function deleteEventAction(id: string) {
  await db.delete(events).where(eq(events.id, id));

  revalidatePath("/admin/events");
}
