"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

import { db } from "@/db/db";
import { events } from "@/db/schema";
import { EVENT_STATUSES } from "@/lib/constants/event";

type EventStatus = (typeof EVENT_STATUSES)[number];

function isEventStatus(value: string): value is EventStatus {
  return EVENT_STATUSES.includes(value as EventStatus);
}

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
    const startDate = getString(formData, "startDate");
    const endDate = getString(formData, "endDate");
    const statusValue = getString(formData, "status");
    const posterImageUrl = getString(formData, "posterImageUrl");
    const posterImageKey = getString(formData, "posterImageKey");

    const status: EventStatus = isEventStatus(statusValue)
      ? statusValue
      : "draft";

    if (!title || !startDate) {
      throw new Error("Missing required event fields.");
    }

    const id = randomUUID();

    const latitudeValue = latitude ? latitude.toString() : null;
    const longitudeValue = longitude ? longitude.toString() : null;
    const geoRadiusMetersValue =
      typeof geoRadiusMeters === "string"
        ? Number(geoRadiusMeters)
        : geoRadiusMeters;

    await db.insert(events).values({
      id,
      slug: `${createSlug(title)}-${id.slice(0, 8)}`,
      title,
      description: description || null,
      location: location || null,
      latitude: latitudeValue,
      longitude: longitudeValue,
      geoRadiusMeters: geoRadiusMetersValue || 80,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      status,
      posterImageUrl: posterImageUrl || null,
      posterImageKey: posterImageKey || null,
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
    const startDate = getString(formData, "startDate");
    const endDate = getString(formData, "endDate");
    const statusValue = getString(formData, "status");
    const posterImageUrl = getString(formData, "posterImageUrl");
    const posterImageKey = getString(formData, "posterImageKey");

    const status: EventStatus = isEventStatus(statusValue)
      ? statusValue
      : "draft";

    if (!id || !title || !startDate) {
      throw new Error("Missing required event fields.");
    }

    const latitudeValue = latitude ? latitude.toString() : null;
    const longitudeValue = longitude ? longitude.toString() : null;
    const geoRadiusMetersValue =
      typeof geoRadiusMeters === "string"
        ? Number(geoRadiusMeters)
        : geoRadiusMeters;

    await db
      .update(events)
      .set({
        title,
        description: description || null,
        location: location || null,
        latitude: latitudeValue,
        longitude: longitudeValue,
        geoRadiusMeters: geoRadiusMetersValue || 80,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status,
        posterImageUrl: posterImageUrl || null,
        posterImageKey: posterImageKey || null,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id));

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
