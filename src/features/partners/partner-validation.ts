import { z } from "zod";

const PARTNER_STATUSES = ["draft", "active", "inactive"] as const;

export const partnerIdSchema = z.string().min(1, "Partner ID is required.");

export const partnerUpdateDataSchema = z.object({
  name: z.string().trim().min(1, "Partner name is required."),
  category: z.string().trim().optional().nullable(),
  websiteUrl: z.string().trim().optional().nullable(),
  facebookUrl: z.string().trim().optional().nullable(),
  description: z.string().trim().optional().nullable(),
  status: z.enum(PARTNER_STATUSES).default("inactive"),
  isOfficial: z.boolean().optional(),
  logoUrl: z.string().trim().optional().nullable(),
  logoKey: z.string().trim().optional().nullable(),
});
