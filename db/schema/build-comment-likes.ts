import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { buildComments } from "./build-comments";
import { users } from "./users";

export const buildCommentLikes = pgTable(
  "build_comment_likes",
  {
    id: text("id").primaryKey(),
    commentId: text("comment_id")
      .notNull()
      .references(() => buildComments.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userCommentUnique: uniqueIndex(
      "build_comment_likes_user_comment_unique",
    ).on(table.userId, table.commentId),
    commentCreatedIdx: index("build_comment_likes_comment_created_idx").on(
      table.commentId,
      table.createdAt,
    ),
  }),
);
