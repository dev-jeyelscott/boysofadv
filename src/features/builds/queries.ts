import { unstable_cache } from "next/cache";
import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db/db";
import { builds, users } from "@/db/schema";
import { searchBuilds } from "@/lib/db/build-search";
import { BUILD_STATUSES } from "@/lib/constants/build";
import { CACHE_TAGS, publicBuildsPageCacheKey } from "@/src/lib/cache/keys";
import { PUBLIC_CACHE_REVALIDATE_SECONDS } from "@/src/lib/cache/public-cache";

export async function getPublicBuildsPage({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const safePage = Math.max(0, page);
  const safeLimit = Math.min(Math.max(1, limit), 24);
  const offset = safePage * safeLimit;

  return unstable_cache(
    () =>
      searchBuilds({
        status: BUILD_STATUSES.PUBLISHED,
        limit: safeLimit,
        offset,
      }),
    [publicBuildsPageCacheKey(safePage, safeLimit)],
    {
      tags: [CACHE_TAGS.publicBuilds],
      revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS.publicBuilds,
    },
  )();
}

export async function getFeaturedPublicBuilds(limit = 10) {
  const safeLimit = Math.min(Math.max(1, limit), 12);

  return unstable_cache(
    () =>
      db
        .select({
          id: builds.id,
          title: builds.title,
          motorcycleModel: builds.motorcycleModel,
          concept: builds.concept,
          description: builds.description,
          coverImageUrl: builds.coverImageUrl,
          ownerFirstName: users.firstName,
          ownerLastName: users.lastName,
          ownerNickname: users.nickname,
          ownerCodename: users.codename,
        })
        .from(builds)
        .innerJoin(users, eq(builds.userId, users.id))
        .where(
          and(
            eq(builds.status, BUILD_STATUSES.PUBLISHED),
            eq(builds.isFeatured, true),
          ),
        )
        .orderBy(desc(builds.publishedAt), desc(builds.createdAt))
        .limit(safeLimit),
    [`${CACHE_TAGS.homepageFeaturedBuilds}:limit:${safeLimit}`],
    {
      tags: [CACHE_TAGS.homepageFeaturedBuilds],
      revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS.homepageFeaturedBuilds,
    },
  )();
}

export async function searchPublicBuilds({
  query,
  offset,
  limit,
}: {
  query: string;
  offset: number;
  limit: number;
}) {
  return searchBuilds({
    query,
    status: BUILD_STATUSES.PUBLISHED,
    limit,
    offset,
  });
}
