import { relations } from "drizzle-orm";
import { users } from "./users";
import { builds } from "./builds";
import { eventAttendance } from "./event-attendance";
import { events } from "./events";

export const usersRelations = relations(users, ({ one }) => ({
  build: one(builds, {
    fields: [users.id],
    references: [builds.userId],
  }),
}));

export const buildsRelations = relations(builds, ({ one }) => ({
  user: one(users, {
    fields: [builds.userId],
    references: [users.id],
  }),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  eventAttendance: many(eventAttendance),
}));

export const eventAttendanceRelations = relations(
  eventAttendance,
  ({ one }) => ({
    event: one(events, {
      fields: [eventAttendance.eventId],
      references: [events.id],
    }),

    user: one(users, {
      fields: [eventAttendance.userId],
      references: [users.id],
    }),
  }),
);
