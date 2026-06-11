import { and, desc, eq, ilike, or, lt, inArray } from "drizzle-orm";
import { BUILD_STATUSES } from "@/lib/constants/build";
import { db } from "@/db/db";
import { builds, galleryImages, users } from "@/db/schema";

type BuildStatus = (typeof BUILD_STATUSES)[keyof typeof BUILD_STATUSES];

type GetAdminBuildsInput = {
  cursor?: string;
  search?: string;
  model?: string;
  concept?: string;
  status?: BuildStatus;
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

  if (status && Object.values(BUILD_STATUSES).includes(status as BuildStatus)) {
    conditions.push(eq(builds.status, status as BuildStatus));
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
    .orderBy(desc(builds.createdAt))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const items = rows.slice(0, limit);

  const buildIds = items.map((item) => item.id);

  const imageRows = buildIds.length
    ? await db
        .select({
          id: galleryImages.id,
          buildId: galleryImages.buildId,
          imageUrl: galleryImages.imageUrl,
        })
        .from(galleryImages)
        .where(inArray(galleryImages.buildId, buildIds))
    : [];

  const imagesByBuildId = imageRows.reduce<Record<string, typeof imageRows>>(
    (acc, image) => {
      if (!image.buildId) return acc;

      acc[image.buildId] ??= [];
      acc[image.buildId].push(image);

      return acc;
    },
    {},
  );

  const itemsWithGalleryImages = items.map((item) => ({
    ...item,
    galleryImages: imagesByBuildId[item.id] ?? [],
  }));

  return {
    itemsWithGalleryImages,
    nextCursor: hasMore
      ? items[items.length - 1]?.createdAt.toISOString()
      : null,
  };
}
