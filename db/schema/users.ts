import { pgTable, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";

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
]);

export const users = pgTable("users", {
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

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
