"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import { type EventStatus, isEventStatus } from "@/lib/constants/event";
import { EventService } from "@/src/features/events/event-service";
import {
  getAdminEvents,
  type GetAdminEventsInput,
} from "@/src/features/events/queries";
import { revalidateEventCaches } from "@/src/lib/cache/revalidate";
import { getServiceActionErrorMessage } from "@/src/lib/errors/handle-service-error";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(formData: FormData, key: string) {
  const value = getString(formData, key);
  return value || null;
}

function getRequiredDate(formData: FormData, key: string) {
  const value = getString(formData, key);
  return value ? new Date(value) : new Date(Number.NaN);
}

function getOptionalDate(formData: FormData, key: string) {
  const value = getString(formData, key);
  return value ? new Date(value) : null;
}

function getEventFormData(formData: FormData) {
  const geoRadiusMeters = getString(formData, "geoRadiusMeters");

  return {
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    location: getString(formData, "location"),
    latitude: getOptionalString(formData, "latitude"),
    longitude: getOptionalString(formData, "longitude"),
    geoRadiusMeters: geoRadiusMeters ? Number(geoRadiusMeters) : 80,
    startsAt: getRequiredDate(formData, "startsAt"),
    endsAt: getOptionalDate(formData, "endsAt"),
    posterImageUrl: getOptionalString(formData, "posterImageUrl"),
    posterImageKey: getOptionalString(formData, "posterImageKey"),
  };
}

function getRequestedStatus(formData: FormData): EventStatus {
  const statusValue = getString(formData, "status");

  return isEventStatus(statusValue) ? statusValue : "draft";
}

export type EventActionState = {
  success: boolean;
  message: string;
};

export async function createEventAction(
  formData: FormData,
): Promise<EventActionState> {
  try {
    const actor = await requireAdmin();
    const requestedStatus = getRequestedStatus(formData);

    if (requestedStatus === "cancelled" || requestedStatus === "completed") {
      return {
        success: false,
        message: "Create the event before cancelling or completing it.",
      };
    }

    const result = await EventService.create({
      actor,
      data: getEventFormData(formData),
    });

    if (requestedStatus === "published") {
      await EventService.publish({
        eventId: result.event.id,
        actor,
      });
    }

    revalidatePath("/admin/events");
    revalidatePath("/events");
    revalidateEventCaches();

    return {
      success: true,
      message: "Event successfully created.",
    };
  } catch (error) {
    return {
      success: false,
      message: getServiceActionErrorMessage(
        error,
        "Failed to create event. Please try again.",
      ),
    };
  }
}

export async function updateEventAction(
  formData: FormData,
): Promise<EventActionState> {
  try {
    const actor = await requireAdmin();
    const id = getString(formData, "id");
    const requestedStatus = getRequestedStatus(formData);

    const result = await EventService.update({
      eventId: id,
      actor,
      data: getEventFormData(formData),
    });

    if (requestedStatus === "published" && result.event.status === "draft") {
      await EventService.publish({ eventId: id, actor });
    }

    if (requestedStatus === "cancelled") {
      await EventService.cancel({
        eventId: id,
        actor,
        reason: "Cancelled by admin.",
      });
    }

    if (requestedStatus === "completed") {
      await EventService.complete({ eventId: id, actor });
    }

    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${id}`);
    revalidatePath("/events");
    revalidateEventCaches();

    return {
      success: true,
      message: "Event successfully updated.",
    };
  } catch (error) {
    return {
      success: false,
      message: getServiceActionErrorMessage(
        error,
        "Failed to update event. Please try again.",
      ),
    };
  }
}

export async function deleteEventAction(id: string): Promise<EventActionState> {
  try {
    const actor = await requireAdmin();

    await EventService.cancel({
      eventId: id,
      actor,
      reason: "Cancelled by admin.",
    });

    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${id}`);
    revalidatePath("/events");
    revalidateEventCaches();

    return {
      success: true,
      message: "Event successfully cancelled.",
    };
  } catch (error) {
    return {
      success: false,
      message: getServiceActionErrorMessage(
        error,
        "Failed to cancel event. Please try again.",
      ),
    };
  }
}

export async function loadMoreAdminEvents(input: GetAdminEventsInput) {
  await requireAdmin();

  return getAdminEvents(input);
}
