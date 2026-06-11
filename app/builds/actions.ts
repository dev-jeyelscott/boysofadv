"use server";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db/db";
import { buildLikes, builds, users } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { getCurrentDbUser } from "@/lib/current-user";

const LIMIT = 20;

export async function getPublishedBuilds(offset = 0) {
  const rows = await db
    .select({
      id: builds.id,
      title: builds.title,
      slug: builds.slug,
      coverImageUrl: builds.coverImageUrl,
      motorcycleModel: builds.motorcycleModel,
      yearModel: builds.yearModel,
      concept: builds.concept,
      isFeatured: builds.isFeatured,
      createdAt: builds.createdAt,
      ownerFirstName: users.firstName,
      ownerLastName: users.lastName,
      ownerNickname: users.nickname,
      ownerCodename: users.codename,
    })
    .from(builds)
    .leftJoin(users, eq(builds.userId, users.id))
    .where(eq(builds.status, "published"))
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
    await db.insert(buildLikes).values({
      id: nanoid(),
      buildId,
      userId: user.id,
    });
  }

  revalidatePath(`/builds/${buildId}`);

  return {
    ok: true,
    liked: !existingLike,
  };
}
