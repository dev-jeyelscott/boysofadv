import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  index,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

import { tsvector } from "./search-vector";

export const userRoleEnum = pgEnum("user_role", [
  "super_admin",
  "member",
  "admin",
]);
export const userStatusEnum = pgEnum("user_status", [
  "for_approval",
  "approved",
  "rejected",
  "suspended",
  "archived",
]);

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),

    clerkUserId: text("clerk_user_id").notNull().unique(),

    email: text("email").notNull().unique(),
    firstName: text("first_name"),
    lastName: text("last_name"),

    nickname: text("nickname"),
    codename: text("codename"),

    chapter: text("chapter"),
    unit: text("unit"),

    role: userRoleEnum("role").notNull().default("member"),
    status: userStatusEnum("status").notNull().default("for_approval"),

    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    history: text("history"),
    buildSummary: text("build_summary"),

    facebookUrl: text("facebook_url"),
    instagramUrl: text("instagram_url"),
    tiktokUrl: text("tiktok_url"),
    youtubeUrl: text("youtube_url"),

    isFeatured: boolean("is_featured").notNull().default(false),

    approvedAt: timestamp("approved_at"),
    approvedBy: text("approved_by_user_id").references(
      (): AnyPgColumn => users.id,
      { onDelete: "set null" },
    ),
    rejectedAt: timestamp("rejected_at"),
    rejectedBy: text("rejected_by_user_id").references(
      (): AnyPgColumn => users.id,
      { onDelete: "set null" },
    ),
    rejectionReason: text("rejection_reason"),
    suspendedAt: timestamp("suspended_at"),
    suspendedBy: text("suspended_by_user_id").references(
      (): AnyPgColumn => users.id,
      { onDelete: "set null" },
    ),

    lastActiveAt: timestamp("last_active_at"),
    inactiveDetectedAt: timestamp("inactive_detected_at"),
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      sql`
        setweight(to_tsvector('simple', coalesce("first_name", '')), 'A') ||
        setweight(to_tsvector('simple', coalesce("last_name", '')), 'A') ||
        setweight(to_tsvector('simple', coalesce("nickname", '')), 'A') ||
        setweight(to_tsvector('simple', coalesce("codename", '')), 'A') ||
        setweight(to_tsvector('simple', coalesce("email", '')), 'B') ||
        setweight(to_tsvector('simple', coalesce("unit", '')), 'C') ||
        setweight(to_tsvector('simple', coalesce("chapter", '')), 'C')
      `,
    ),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("users_email_idx").on(table.email),
    index("users_status_idx").on(table.status),
    index("users_role_idx").on(table.role),
    index("users_created_at_idx").on(table.createdAt),
    index("users_status_created_at_idx").on(
      table.status,
      table.createdAt.desc(),
    ),
    index("users_role_status_idx").on(table.role, table.status),
    index("users_approved_by_idx").on(table.approvedBy),
    index("users_rejected_by_idx").on(table.rejectedBy),
    index("users_suspended_by_idx").on(table.suspendedBy),
    index("users_search_vector_idx").using("gin", table.searchVector),
  ],
);
