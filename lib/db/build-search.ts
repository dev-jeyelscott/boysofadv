import { and, desc, eq, inArray } from "drizzle-orm";

import { db } from "@/db/db";
import { builds, users } from "@/db/schema";
import { BUILD_STATUSES, type BuildStatus } from "@/lib/constants/build";
import {
  hasSearchQuery,
  normalizeSearchQuery,
  searchRank,
  searchVectorMatches,
} from "@/lib/db/search";

type SearchBuildsInput = {
  query?: string | null;
  status?: BuildStatus | BuildStatus[];
  limit?: number;
  offset?: number;
  model?: string | null;
  concept?: string | null;
  isFeatured?: boolean | null;
};

export async function searchBuilds({
  query,
  status,
  limit = 12,
  offset = 0,
  model,
  concept,
  isFeatured,
}: SearchBuildsInput) {
  const normalizedQuery = hasSearchQuery(query)
    ? normalizeSearchQuery(query ?? "")
    : "";
  const rank = normalizedQuery
    ? searchRank(builds.searchVector, "english", normalizedQuery)
    : undefined;

  const conditions = [];

  if (Array.isArray(status)) {
    if (status.length > 0) {
      conditions.push(inArray(builds.status, status));
    }
  } else if (status) {
    conditions.push(eq(builds.status, status));
  }

  if (normalizedQuery) {
    conditions.push(
      searchVectorMatches(builds.searchVector, "english", normalizedQuery),
    );
  }

  if (model) {
    conditions.push(eq(builds.motorcycleModel, model));
  }

  if (concept) {
    conditions.push(eq(builds.concept, concept));
  }

  if (typeof isFeatured === "boolean") {
    conditions.push(eq(builds.isFeatured, isFeatured));
  }

  const rows = await db
    .select({
      id: builds.id,
      title: builds.title,
      slug: builds.slug,
      status: builds.status,
      isFeatured: builds.isFeatured,
      coverImageUrl: builds.coverImageUrl,
      motorcycleModel: builds.motorcycleModel,
      yearModel: builds.yearModel,
      concept: builds.concept,
      description: builds.description,
      engineSetup: builds.engineSetup,
      cvtSetup: builds.cvtSetup,
      suspensionSetup: builds.suspensionSetup,
      brakingSetup: builds.brakingSetup,
      wheelSetup: builds.wheelSetup,
      accessories: builds.accessories,
      createdAt: builds.createdAt,
      updatedAt: builds.updatedAt,

      ownerId: users.id,
      ownerEmail: users.email,
      ownerFirstName: users.firstName,
      ownerLastName: users.lastName,
      ownerNickname: users.nickname,
      ownerCodename: users.codename,
    })
    .from(builds)
    .innerJoin(users, eq(builds.userId, users.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(
      ...(rank
        ? [
            desc(rank),
            desc(builds.isFeatured),
            desc(builds.createdAt),
          ]
        : status === BUILD_STATUSES.PUBLISHED
          ? [desc(builds.popularityScore), desc(builds.publishedAt)]
          : [desc(builds.createdAt)]),
    )
    .limit(limit + 1)
    .offset(offset);

  return {
    items: rows.slice(0, limit),
    hasMore: rows.length > limit,
  };
}
