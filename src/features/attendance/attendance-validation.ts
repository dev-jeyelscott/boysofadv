import { z } from "zod";

export const attendanceCheckInSchema = z.object({
  eventId: z.string().min(1, "Event ID is required."),
  memberId: z.string().min(1, "Member ID is required."),
  token: z.string().min(1, "Missing attendance token."),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  gpsAccuracyMeters: z.number().nonnegative().optional().nullable(),
});

export const eventAttendanceSchema = z.object({
  eventId: z.string().min(1, "Event ID is required."),
});
