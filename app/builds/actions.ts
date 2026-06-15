"use server";

import { and, desc, eq, or, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/db";
import { buildLikes, builds, users } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { getCurrentDbUser } from "@/lib/current-user";
import { sendPushNotificationToUser } from "@/lib/send-push-notification";
import { BUILD_STATUSES } from "@/lib/constants/build";
import { USER_STATUSES } from "@/lib/constants/user";
import { touchUserActivity } from "@/lib/auth/touch-user-activity";
import { canDeleteBuildComment } from "@/lib/permissions/build-comment-permissions";
import {
  hasSearchQuery,
  normalizeSearchQuery,
  searchRank,
  searchVectorMatches,
} from "@/lib/db/search";

const LIMIT = 9;
const COMMENT_BODY_MAX_LENGTH = 1000;

const commentBodySchema = z
  .string()
  .trim()
  .min(1, "Write a comment before posting.")
  .max(
    COMMENT_BODY_MAX_LENGTH,
    `Comments must be ${COMMENT_BODY_MAX_LENGTH} characters or fewer.`,
  );

const createCommentSchema = z.object({
  buildId: z.string().min(1),
  body: commentBodySchema,
  parentId: z.string().min(1).optional(),
});

type CommentAuthor = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  nickname: string | null;
  codename: string | null;
  avatarUrl: string | null;
  role: string;
};

type BuildCommentRow = {
  id: string;
  buildId: string;
  parentId: string | null;
  body: string;
  userId: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  authorFirstName: string | null;
  authorLastName: string | null;
  authorNickname: string | null;
  authorCodename: string | null;
  authorAvatarUrl: string | null;
  authorRole: string;
  likeCount: number;
  isLikedByMe: boolean;
};

export type BuildCommentThreadItem = {
  id: string;
  buildId: string;
  parentId: string | null;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  author: CommentAuthor;
  likeCount: number;
  isLikedByMe: boolean;
  canDelete: boolean;
  canReply: boolean;
  canLike: boolean;
  replies: BuildCommentThreadItem[];
};

async function getApprovedActionUser() {
  const user = await getCurrentDbUser();

  if (!user) {
    return {
      ok: false as const,
      message: "You need to sign in first.",
      user: null,
    };
  }

  if (user.status !== USER_STATUSES.APPROVED) {
    return {
      ok: false as const,
      message: "Your account must be approved before interacting.",
      user: null,
    };
  }

  return {
    ok: true as const,
    message: "",
    user,
  };
}

function getActionErrorMessage(error: unknown, fallback: string) {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? fallback;
  }

  return fallback;
}

export async function getPublishedBuilds(offset = 0, search = "") {
  const query = hasSearchQuery(search) ? normalizeSearchQuery(search) : "";
  const buildRank = query
    ? searchRank(builds.searchVector, "english", query)
    : undefined;
  const ownerRank = query
    ? searchRank(users.searchVector, "simple", query)
    : undefined;
  const combinedRank =
    buildRank && ownerRank
      ? sql<number>`(${buildRank} + coalesce(${ownerRank}, 0))`
      : undefined;

  const searchCondition = query
    ? or(
        searchVectorMatches(builds.searchVector, "english", query),
        searchVectorMatches(users.searchVector, "simple", query),
      )
    : undefined;

  const rows = await db
    .select({
      id: builds.id,
      title: builds.title,
      slug: builds.slug,
      coverImageUrl: builds.coverImageUrl,
      motorcycleModel: builds.motorcycleModel,
      yearModel: builds.yearModel,
      concept: builds.concept,
      description: builds.description,
      engineSetup: builds.engineSetup,
      brakingSetup: builds.brakingSetup,
      suspensionSetup: builds.suspensionSetup,
      cvtSetup: builds.cvtSetup,
      wheelSetup: builds.wheelSetup,
      accessories: builds.accessories,
      isFeatured: builds.isFeatured,
      createdAt: builds.createdAt,
      ownerFirstName: users.firstName,
      ownerLastName: users.lastName,
      ownerNickname: users.nickname,
      ownerCodename: users.codename,
    })
    .from(builds)
    .leftJoin(users, eq(builds.userId, users.id))
    .where(
      query
        ? and(eq(builds.status, BUILD_STATUSES.PUBLISHED), searchCondition)
        : eq(builds.status, BUILD_STATUSES.PUBLISHED),
    )
    .orderBy(
      ...(combinedRank
        ? [desc(combinedRank), desc(builds.createdAt)]
        : [desc(builds.popularityScore), desc(builds.publishedAt)]),
    )
    .limit(LIMIT + 1)
    .offset(offset);

  return {
    builds: rows.slice(0, LIMIT),
    hasMore: rows.length > LIMIT,
  };
}

export async function getBuildComments(buildId: string) {
  const currentUser = await getCurrentDbUser();

  const [build] = await db
    .select({ id: builds.id, status: builds.status })
    .from(builds)
    .where(eq(builds.id, buildId))
    .limit(1);

  if (!build || build.status !== BUILD_STATUSES.PUBLISHED) {
    return {
      comments: [] as BuildCommentThreadItem[],
      totalCount: 0,
      currentUser: currentUser
        ? {
            id: currentUser.id,
            role: currentUser.role,
            status: currentUser.status,
          }
        : null,
    };
  }

  const commentRows = await db.execute<BuildCommentRow>(sql`
    select
      bc.id,
      bc.build_id as "buildId",
      bc.parent_id as "parentId",
      bc.body,
      bc.user_id as "userId",
      bc.deleted_at as "deletedAt",
      bc.created_at as "createdAt",
      bc.updated_at as "updatedAt",
      u.first_name as "authorFirstName",
      u.last_name as "authorLastName",
      u.nickname as "authorNickname",
      u.codename as "authorCodename",
      u.avatar_url as "authorAvatarUrl",
      u.role as "authorRole",
      coalesce(like_stats.like_count, 0)::int as "likeCount",
      case
        when bc.deleted_at is null and viewer_like.id is not null then true
        else false
      end as "isLikedByMe"
    from build_comments bc
    inner join builds b on b.id = bc.build_id
    inner join users u on u.id = bc.user_id
    left join lateral (
      select count(*)::int as like_count
      from build_comment_likes bcl
      where bcl.comment_id = bc.id
    ) like_stats on true
    left join build_comment_likes viewer_like
      on viewer_like.comment_id = bc.id
      and viewer_like.user_id = ${currentUser?.id ?? null}
    where bc.build_id = ${buildId}
    order by bc.created_at asc
  `);

  const visibleRows = commentRows.filter((comment) => !comment.deletedAt);

  const toThreadItem = (comment: BuildCommentRow): BuildCommentThreadItem => {
    const isDeleted = Boolean(comment.deletedAt);

    return {
      id: comment.id,
      buildId: comment.buildId,
      parentId: comment.parentId,
      body: isDeleted ? "" : comment.body,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      deletedAt: comment.deletedAt,
      author: {
        id: comment.userId,
        firstName: comment.authorFirstName,
        lastName: comment.authorLastName,
        nickname: comment.authorNickname,
        codename: comment.authorCodename,
        avatarUrl: comment.authorAvatarUrl,
        role: comment.authorRole,
      },
      likeCount: comment.likeCount,
      isLikedByMe: comment.isLikedByMe,
      canDelete: canDeleteBuildComment(currentUser ?? null, {
        userId: comment.userId,
        deletedAt: comment.deletedAt,
      }),
      canReply:
        Boolean(currentUser) &&
        currentUser?.status === USER_STATUSES.APPROVED &&
        !isDeleted &&
        comment.parentId === null,
      canLike:
        Boolean(currentUser) &&
        currentUser?.status === USER_STATUSES.APPROVED &&
        !isDeleted,
      replies: [],
    };
  };

  const repliesByParentId = new Map<string, BuildCommentThreadItem[]>();

  for (const reply of visibleRows.filter((comment) => comment.parentId)) {
    const parentId = reply.parentId;

    if (!parentId) continue;

    const replies = repliesByParentId.get(parentId) ?? [];
    replies.push(toThreadItem(reply));
    repliesByParentId.set(parentId, replies);
  }

  const comments = commentRows
    .filter((comment) => comment.parentId === null)
    .map((comment) => ({
      ...toThreadItem(comment),
      replies: repliesByParentId.get(comment.id) ?? [],
    }))
    .filter((comment) => !comment.deletedAt || comment.replies.length > 0)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return {
    comments,
    totalCount: visibleRows.length,
    currentUser: currentUser
      ? {
          id: currentUser.id,
          role: currentUser.role,
          status: currentUser.status,
        }
      : null,
  };
}

export async function createBuildComment(input: {
  buildId: string;
  body: string;
  parentId?: string;
}) {
  try {
    const authResult = await getApprovedActionUser();

    if (!authResult.ok) {
      return {
        ok: false,
        message: authResult.message,
      };
    }

    await touchUserActivity(authResult.user.id);

    const payload = createCommentSchema.parse(input);

    const result = await db.transaction(async (tx) => {
      const [build] = await tx
        .select({ id: builds.id, status: builds.status })
        .from(builds)
        .where(eq(builds.id, payload.buildId))
        .limit(1);

      if (!build || build.status !== BUILD_STATUSES.PUBLISHED) {
        return {
          ok: false,
          message: "This build is not available for comments.",
        };
      }

      if (payload.parentId) {
        const [parentComment] = await tx.execute<{
          id: string;
          buildId: string;
          parentId: string | null;
          deletedAt: Date | null;
        }>(sql`
          select
            id,
            build_id as "buildId",
            parent_id as "parentId",
            deleted_at as "deletedAt"
          from build_comments
          where id = ${payload.parentId}
          limit 1
        `);

        if (
          !parentComment ||
          parentComment.buildId !== payload.buildId ||
          parentComment.deletedAt ||
          parentComment.parentId
        ) {
          return {
            ok: false,
            message: "You can only reply to active top-level comments.",
          };
        }
      }

      await tx.execute(sql`
        insert into build_comments (
          id,
          build_id,
          user_id,
          parent_id,
          body,
          created_at,
          updated_at
        )
        values (
          ${nanoid()},
          ${payload.buildId},
          ${authResult.user.id},
          ${payload.parentId ?? null},
          ${payload.body},
          now(),
          now()
        )
      `);

      return {
        ok: true,
        message: payload.parentId ? "Reply posted." : "Comment posted.",
      };
    });

    if (result.ok) {
      revalidatePath(`/builds/${payload.buildId}`);

      const commentsData = await getBuildComments(payload.buildId);

      return {
        ...result,
        comments: commentsData.comments,
        totalCount: commentsData.totalCount,
      };
    }

    return result;
  } catch (error) {
    return {
      ok: false,
      message: getActionErrorMessage(error, "Failed to post comment."),
    };
  }
}

export async function toggleBuildCommentLike(commentId: string) {
  const authResult = await getApprovedActionUser();

  if (!authResult.ok) {
    return {
      ok: false,
      message: authResult.message,
      liked: false,
      likeCount: 0,
    };
  }

  const [comment] = await db.execute<{
    id: string;
    buildId: string;
    deletedAt: Date | null;
    buildStatus: string;
  }>(sql`
    select
      bc.id,
      bc.build_id as "buildId",
      bc.deleted_at as "deletedAt",
      b.status as "buildStatus"
    from build_comments bc
    inner join builds b on b.id = bc.build_id
    where bc.id = ${commentId}
    limit 1
  `);

  if (
    !comment ||
    comment.deletedAt ||
    comment.buildStatus !== BUILD_STATUSES.PUBLISHED
  ) {
    return {
      ok: false,
      message: "This comment is no longer available.",
      liked: false,
      likeCount: 0,
    };
  }

  const [existingLike] = await db.execute<{ id: string }>(sql`
    select id
    from build_comment_likes
    where comment_id = ${commentId}
      and user_id = ${authResult.user.id}
    limit 1
  `);

  if (existingLike) {
    await db.execute(sql`
      delete from build_comment_likes
      where id = ${existingLike.id}
    `);
  } else {
    await db.execute(sql`
      insert into build_comment_likes (
        id,
        comment_id,
        user_id,
        created_at
      )
      values (
        ${nanoid()},
        ${commentId},
        ${authResult.user.id},
        now()
      )
      on conflict (user_id, comment_id) do nothing
    `);
  }

  const [likeStats] = await db.execute<{ count: number }>(sql`
    select count(*)::int as count
    from build_comment_likes
    where comment_id = ${commentId}
  `);

  revalidatePath(`/builds/${comment.buildId}`);
  const commentsData = await getBuildComments(comment.buildId);

  return {
    ok: true,
    message: existingLike ? "Comment unliked." : "Comment liked.",
    liked: !existingLike,
    likeCount: likeStats?.count ?? 0,
    comments: commentsData.comments,
    totalCount: commentsData.totalCount,
  };
}

export async function deleteBuildComment(commentId: string) {
  const authResult = await getApprovedActionUser();

  if (!authResult.ok) {
    return {
      ok: false,
      message: authResult.message,
    };
  }

  const [comment] = await db.execute<{
    id: string;
    buildId: string;
    userId: string;
    deletedAt: Date | null;
    buildStatus: string;
  }>(sql`
    select
      bc.id,
      bc.build_id as "buildId",
      bc.user_id as "userId",
      bc.deleted_at as "deletedAt",
      b.status as "buildStatus"
    from build_comments bc
    inner join builds b on b.id = bc.build_id
    where bc.id = ${commentId}
    limit 1
  `);

  if (!comment || comment.buildStatus !== BUILD_STATUSES.PUBLISHED) {
    return {
      ok: false,
      message: "This comment is no longer available.",
    };
  }

  if (comment.deletedAt) {
    return {
      ok: false,
      message: "This comment is already deleted.",
    };
  }

  if (!canDeleteBuildComment(authResult.user, comment)) {
    return {
      ok: false,
      message: "You do not have permission to delete this comment.",
    };
  }

  await db.execute(sql`
    update build_comments
    set
      deleted_at = now(),
      deleted_by_user_id = ${authResult.user.id},
      updated_at = now()
    where id = ${commentId}
  `);

  revalidatePath(`/builds/${comment.buildId}`);
  const commentsData = await getBuildComments(comment.buildId);

  return {
    ok: true,
    message: "Comment deleted.",
    comments: commentsData.comments,
    totalCount: commentsData.totalCount,
  };
}

export async function toggleBuildLike(buildId: string) {
  const user = await getCurrentDbUser();

  if (!user) {
    return {
      ok: false,
      message: "You need to sign in to like this build.",
    };
  }

  const [existingLike] = await db
    .select({ id: buildLikes.id })
    .from(buildLikes)
    .where(and(eq(buildLikes.buildId, buildId), eq(buildLikes.userId, user.id)))
    .limit(1);

  if (existingLike) {
    await db.delete(buildLikes).where(eq(buildLikes.id, existingLike.id));
  } else {
    const [build] = await db
      .select({
        id: builds.id,
        title: builds.title,
        slug: builds.slug,
        ownerId: builds.userId,
      })
      .from(builds)
      .where(eq(builds.id, buildId))
      .limit(1);

    if (!build) {
      return {
        ok: false,
        message: "This build no longer exists.",
      };
    }

    await db.insert(buildLikes).values({
      id: nanoid(),
      buildId,
      userId: user.id,
    });

    // Don't notify yourself when liking your own build
    if (build && build.ownerId !== user.id) {
      const likerName =
        user.nickname || user.firstName || user.codename || "A member";

      try {
        await sendPushNotificationToUser(build.ownerId, {
          title: "New Build Like",
          body: `${likerName} liked your build "${build.title}".`,
          url: `/builds/${build.slug}`,
        });
      } catch (error) {
        // Log but don't fail the action - like was successful
        console.error("Failed to send build like notification:", error);
      }
    }
  }

  revalidatePath(`/builds/${buildId}`);

  return {
    ok: true,
    liked: !existingLike,
  };
}
