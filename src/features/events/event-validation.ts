import { z } from "zod";

export const eventIdSchema = z.string().min(1, "Event ID is required.");

const validDateSchema = z
  .date()
  .refine((value) => !Number.isNaN(value.getTime()), "Invalid event date.");

export const eventDataSchema = z.object({
  title: z.string().trim().min(1, "Event title is required."),
  description: z.string().trim().min(1, "Event description is required."),
  startsAt: validDateSchema,
  endsAt: validDateSchema.optional().nullable(),
  location: z.string().trim().min(1, "Event location is required."),
  latitude: z.string().trim().optional().nullable(),
  longitude: z.string().trim().optional().nullable(),
  geoRadiusMeters: z.number().int().positive().optional(),
  posterImageUrl: z.string().trim().optional().nullable(),
  posterImageKey: z.string().trim().optional().nullable(),
});

export const cancelEventSchema = z.object({
  eventId: eventIdSchema,
  reason: z.string().trim().min(1, "Cancellation reason is required."),
});
