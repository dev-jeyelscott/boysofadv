import { relations } from "drizzle-orm";
import { users } from "./users";
import { builds } from "./builds";

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