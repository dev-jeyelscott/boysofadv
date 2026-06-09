import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const joinRequestStatusEnum = pgEnum("join_request_status", [
  "pending",
  "approved",
  "rejected",
]);

export const joinRequests = pgTable("join_requests", {
  id: text("id").primaryKey(),

  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),

  motorcycleModel: text("motorcycle_model"),
  motorcycleYear: text("motorcycle_year"),

  facebookUrl: text("facebook_url"),
  message: text("message"),

  status: joinRequestStatusEnum("status").notNull().default("pending"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
