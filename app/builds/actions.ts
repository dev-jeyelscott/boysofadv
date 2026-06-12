"use server";

import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

import { db } from "@/db/db";
import { buildLikes, builds, users } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { getCurrentDbUser } from "@/lib/current-user";
import { sendPushNotificationToUser } from "@/lib/send-push-notification";
import { BUILD_STATUSES } from "@/lib/constants/build";

const LIMIT = 20;

export async function getPublishedBuilds(offset = 0, search = "") {
  const query = search.trim();

  const searchCondition = query
    ? or(
        // Build fields
        ilike(builds.title, `%${query}%`),
        ilike(builds.motorcycleModel, `%${query}%`),
        ilike(builds.description, `%${query}%`),
        ilike(builds.engineSetup, `%${query}%`),
        ilike(builds.brakingSetup, `%${query}%`),
        ilike(builds.suspensionSetup, `%${query}%`),
        ilike(builds.cvtSetup, `%${query}%`),
        ilike(builds.wheelSetup, `%${query}%`),
        ilike(builds.accessories, `%${query}%`),

        // Owner fields
        ilike(users.firstName, `%${query}%`),
        ilike(users.lastName, `%${query}%`),
        ilike(users.nickname, `%${query}%`),
        ilike(users.codename, `%${query}%`),

        // Full name searches
        ilike(
          sql`concat(${users.firstName}, ' ', ${users.lastName})`,
          `%${query}%`,
        ),
        ilike(
          sql`concat(${users.lastName}, ' ', ${users.firstName})`,
          `%${query}%`,
        ),
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
    .orderBy(desc(builds.isFeatured), desc(builds.createdAt))
    .limit(LIMIT + 1)
    .offset(offset);

  return {
    builds: rows.slice(0, LIMIT),
    hasMore: rows.length > LIMIT,
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
