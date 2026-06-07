import {
  pgTable,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const contactMessageStatusEnum = pgEnum("contact_message_status", [
  "new",
  "read",
  "replied",
  "archived",
]);

export const contactMessages = pgTable("contact_messages", {
  id: text("id").primaryKey(),

  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),

  status: contactMessageStatusEnum("status").notNull().default("new"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});