import { sql } from "drizzle-orm";
import {
  check,
  index,
  pgTable,
  text,
  timestamp,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

import { builds } from "./builds";
import { users } from "./users";

export const buildComments = pgTable(
  "build_comments",
  {
    id: text("id").primaryKey(),
    buildId: text("build_id")
      .notNull()
      .references(() => builds.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    parentId: text("parent_id").references(
      (): AnyPgColumn => buildComments.id,
      { onDelete: "cascade" },
    ),
    body: text("body").notNull(),
    deletedAt: timestamp("deleted_at"),
    deletedByUserId: text("deleted_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    buildParentCreatedIdx: index("build_comments_build_parent_created_idx").on(
      table.buildId,
      table.parentId,
      table.createdAt,
    ),
    parentCreatedIdx: index("build_comments_parent_created_idx").on(
      table.parentId,
      table.createdAt,
    ),
    userCreatedIdx: index("build_comments_user_created_idx").on(
      table.userId,
      table.createdAt,
    ),
    activeBuildCreatedIdx: index("build_comments_active_build_created_idx")
      .on(table.buildId, table.createdAt)
      .where(sql`${table.deletedAt} is null`),
    notSelfParent: check(
      "build_comments_not_self_parent",
      sql`${table.parentId} is null or ${table.parentId} <> ${table.id}`,
    ),
    bodyNotBlank: check(
      "build_comments_body_not_blank",
      sql`length(trim(${table.body})) > 0`,
    ),
  }),
);
