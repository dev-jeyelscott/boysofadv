import { relations } from "drizzle-orm";
import { users } from "./users";
import { builds } from "./builds";
import { buildComments } from "./build-comments";
import { buildCommentLikes } from "./build-comment-likes";
import { eventAttendance } from "./event-attendance";
import { events } from "./events";

export const usersRelations = relations(users, ({ many, one }) => ({
  build: one(builds, {
    fields: [users.id],
    references: [builds.userId],
  }),
  buildComments: many(buildComments, { relationName: "buildCommentAuthor" }),
  deletedBuildComments: many(buildComments, {
    relationName: "buildCommentDeletedBy",
  }),
  buildCommentLikes: many(buildCommentLikes, {
    relationName: "buildCommentLikeUser",
  }),
  deletedBuildCommentLikes: many(buildCommentLikes, {
    relationName: "buildCommentLikeDeletedBy",
  }),
}));

export const buildsRelations = relations(builds, ({ many, one }) => ({
  user: one(users, {
    fields: [builds.userId],
    references: [users.id],
  }),
  comments: many(buildComments),
}));

export const buildCommentsRelations = relations(
  buildComments,
  ({ many, one }) => ({
    build: one(builds, {
      fields: [buildComments.buildId],
      references: [builds.id],
    }),
    user: one(users, {
      fields: [buildComments.userId],
      references: [users.id],
      relationName: "buildCommentAuthor",
    }),
    parent: one(buildComments, {
      fields: [buildComments.parentId],
      references: [buildComments.id],
      relationName: "comment_replies",
    }),
    replies: many(buildComments, {
      relationName: "comment_replies",
    }),
    likes: many(buildCommentLikes),
    deletedByUser: one(users, {
      fields: [buildComments.deletedByUserId],
      references: [users.id],
      relationName: "buildCommentDeletedBy",
    }),
  }),
);

export const buildCommentLikesRelations = relations(
  buildCommentLikes,
  ({ one }) => ({
    comment: one(buildComments, {
      fields: [buildCommentLikes.commentId],
      references: [buildComments.id],
    }),
    user: one(users, {
      fields: [buildCommentLikes.userId],
      references: [users.id],
      relationName: "buildCommentLikeUser",
    }),
  }),
);

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
