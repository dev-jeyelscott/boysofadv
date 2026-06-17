import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const partnerInquiryStatusEnum = pgEnum("partner_inquiry_status", [
  "new",
  "contacted",
  "approved",
  "rejected",
]);

export const partnerInquiries = pgTable("partner_inquiries", {
  id: text("id").primaryKey(),

  businessName: text("business_name").notNull(),
  contactName: text("contact_person").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),

  websiteUrl: text("website_url"),
  facebookUrl: text("facebook_url"),

  message: text("message").notNull(),

  status: partnerInquiryStatusEnum("status").notNull().default("new"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  contactedAt: timestamp("contacted_at"),
  approvedAt: timestamp("approved_at"),
  rejectedAt: timestamp("rejected_at"),
});
