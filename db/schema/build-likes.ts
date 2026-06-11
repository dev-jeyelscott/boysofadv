import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { builds } from "./builds";
import { users } from "./users";

export const buildLikes = pgTable(
  "build_likes",
  {
    id: text("id").primaryKey(),
    buildId: text("build_id")
      .notNull()
      .references(() => builds.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userBuildUnique: uniqueIndex("build_likes_user_build_unique").on(
      table.userId,
      table.buildId,
    ),
  }),
);
