import { z } from "zod";

export const buildIdSchema = z.string().min(1, "Build ID is required.");

export const rejectBuildSchema = z.object({
  buildId: buildIdSchema,
  reason: z.string().trim().min(1, "Rejection reason is required."),
});
