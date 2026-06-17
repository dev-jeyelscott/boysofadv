import { z } from "zod";

export const PARTNER_INQUIRY_STATUSES = [
  "new",
  "contacted",
  "approved",
  "rejected",
] as const;

export type PartnerInquiryStatus = (typeof PARTNER_INQUIRY_STATUSES)[number];

const optionalUrlSchema = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => value || null)
  .pipe(z.url("Enter a valid URL.").nullable());

export const partnerInquiryIdSchema = z
  .string()
  .min(1, "Partner inquiry ID is required.");

export const partnerInquiryCreateSchema = z.object({
  businessName: z.string().trim().min(1, "Business name is required."),
  contactName: z.string().trim().min(1, "Contact name is required."),
  email: z.email("Enter a valid email address.").trim(),
  phoneNumber: z.string().trim().min(1, "Phone number is required."),
  message: z.string().trim().min(1, "Message is required."),
  websiteUrl: optionalUrlSchema,
  facebookUrl: optionalUrlSchema,
});

export type CreatePartnerInquiryInput = z.input<
  typeof partnerInquiryCreateSchema
>;
