import { and, asc, desc, eq, ilike, or, lt } from "drizzle-orm";

import { db } from "@/db/db";
import { builds, users } from "@/db/schema";

type GetAdminBuildsInput = {
  cursor?: string;
  search?: string;
  model?: string;
  concept?: string;
  status?: string;
  isFeatured?: string;
  limit?: number;
};

export async function getAdminBuilds({
  cursor,
  search,
  model,
  concept,
  status,
  isFeatured,
  limit = 12,
}: GetAdminBuildsInput) {
  const conditions = [];

  if (cursor) {
    conditions.push(lt(builds.createdAt, new Date(cursor)));
  }

  if (search) {
    conditions.push(
      or(
        ilike(builds.title, `%${search}%`),
        ilike(users.firstName, `%${search}%`),
        ilike(users.lastName, `%${search}%`),
        ilike(users.nickname, `%${search}%`),
        ilike(users.codename, `%${search}%`),
        ilike(users.email, `%${search}%`),
      ),
    );
  }

  if (model) {
    conditions.push(eq(builds.motorcycleModel, model));
  }

  if (concept) {
    conditions.push(eq(builds.concept, concept));
  }

  if (status) {
    conditions.push(eq(builds.status, status as any));
  }

  if (isFeatured === "true") {
    conditions.push(eq(builds.isFeatured, true));
  }

  if (isFeatured === "false") {
    conditions.push(eq(builds.isFeatured, false));
  }

  const rows = await db
    .select({
      id: builds.id,
      title: builds.title,
      status: builds.status,
      isFeatured: builds.isFeatured,
      coverImageUrl: builds.coverImageUrl,
      motorcycleModel: builds.motorcycleModel,
      concept: builds.concept,
      yearModel: builds.yearModel,
      description: builds.description,
      engineSetup: builds.engineSetup,
      cvtSetup: builds.cvtSetup,
      suspensionSetup: builds.suspensionSetup,
      brakingSetup: builds.brakingSetup,
      wheelSetup: builds.wheelSetup,
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
    .orderBy(desc(builds.createdAt))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const items = rows.slice(0, limit);

  return {
    items,
    nextCursor: hasMore
      ? items[items.length - 1]?.createdAt.toISOString()
      : null,
  };
}
