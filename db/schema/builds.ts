import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  integer,
  index,
} from "drizzle-orm/pg-core";

import { tsvector } from "./search-vector";
import { users } from "./users";

export const buildStatusEnum = pgEnum("build_status", [
  "draft",
  "for_review",
  "published",
  "unpublished",
  "rejected",
  "archived",
]);

export const builds = pgTable(
  "builds",
  {
    id: text("id").primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),

    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),

    motorcycleModel: text("motorcycle_model").notNull(), // ADV 150 / ADV 160
    yearModel: text("year_model"),

    description: text("description"),
    concept: text("concept"),
    engineSetup: text("engine_setup"),
    cvtSetup: text("cvt_setup"),
    suspensionSetup: text("suspension_setup"),
    brakingSetup: text("braking_setup"),
    wheelSetup: text("wheel_setup"),
    accessories: text("accessories"),

    coverImageUrl: text("cover_image_url"),
    coverImageKey: text("cover_image_key"),

    popularityScore: integer("popularity_score").notNull().default(0),
    popularityCalculatedAt: timestamp("popularity_calculated_at"),

    status: buildStatusEnum("status").notNull().default("draft"),
    isFeatured: boolean("is_featured").notNull().default(false),

    submittedAt: timestamp("submitted_at"),
    publishedAt: timestamp("published_at"),
    reviewedAt: timestamp("reviewed_at"),
    reviewedBy: text("reviewed_by").references(() => users.id, {
      onDelete: "set null",
    }),
    rejectionReason: text("rejection_reason"),

    searchVector: tsvector("search_vector"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("builds_status_idx").on(table.status),
    index("builds_user_id_idx").on(table.userId),
    index("builds_is_featured_idx").on(table.isFeatured),
    index("builds_created_at_idx").on(table.createdAt),
    index("builds_updated_at_idx").on(table.updatedAt),
    index("builds_status_created_at_idx").on(
      table.status,
      table.createdAt.desc(),
    ),
    index("builds_user_id_status_idx").on(table.userId, table.status),
    index("builds_review_queue_idx").on(table.status, table.submittedAt.desc()),
    index("builds_public_listing_idx").on(
      table.status,
      table.popularityScore.desc(),
      table.publishedAt.desc(),
    ),
    index("builds_reviewed_by_idx").on(table.reviewedBy),
    index("builds_search_vector_idx").using("gin", table.searchVector),
  ],
);
