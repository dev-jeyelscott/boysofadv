import {
  pgTable,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const partnerInquiryStatusEnum = pgEnum("partner_inquiry_status", [
  "new",
  "contacted",
  "approved",
  "rejected",
]);

export const partnerInquiries = pgTable("partner_inquiries", {
  id: text("id").primaryKey(),

  businessName: text("business_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),

  websiteUrl: text("website_url"),
  facebookUrl: text("facebook_url"),

  message: text("message"),

  status: partnerInquiryStatusEnum("status").notNull().default("new"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});