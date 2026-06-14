import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { events } from "./events";
import { nanoid } from "nanoid";

export const eventReminders = pgTable(
  "event_reminders",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),

    eventId: text("event_id")
      .notNull()
      .references(() => events.id, {
        onDelete: "cascade",
      }),

    reminderType: text("reminder_type", {
      enum: ["7_days", "1_day", "2_hours"],
    }).notNull(),

    sentAt: timestamp("sent_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    uniqueEventReminder: uniqueIndex("event_reminders_event_id_type_unique").on(
      table.eventId,
      table.reminderType,
    ),
  }),
);

export type EventReminderType =
  (typeof eventReminders.$inferSelect)["reminderType"];
