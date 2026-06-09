"use server";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db/db";
import { builds, users } from "@/db/schema";

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
