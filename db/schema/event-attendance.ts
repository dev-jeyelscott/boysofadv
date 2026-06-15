import {
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { events } from "./events";
import { users } from "./users";
import { nanoid } from "nanoid";

export const eventAttendance = pgTable(
  "event_attendance",
  {
    id: text("id")
      .$defaultFn(() => nanoid())
      .primaryKey(),

    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),

    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),

    status: text("status").notNull().default("checked_in"),

    checkInLatitude: numeric("check_in_latitude", {
      precision: 10,
      scale: 7,
    }).notNull(),

    checkInLongitude: numeric("check_in_longitude", {
      precision: 10,
      scale: 7,
    }).notNull(),

    gpsAccuracyMeters: numeric("gps_accuracy_meters", {
      precision: 10,
      scale: 2,
    }),

    distanceMeters: numeric("distance_meters", {
      precision: 10,
      scale: 2,
    }).notNull(),

    checkedInAt: timestamp("checked_in_at").defaultNow().notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("event_attendance_event_user_unique_idx").on(
      table.eventId,
      table.userId,
    ),
    index("event_attendance_event_id_idx").on(table.eventId),
    index("event_attendance_user_id_idx").on(table.userId),
    index("event_attendance_event_checked_in_idx").on(
      table.eventId,
      table.checkedInAt.desc(),
    ),
    index("event_attendance_user_checked_in_idx").on(
      table.userId,
      table.checkedInAt.desc(),
    ),
  ],
);
