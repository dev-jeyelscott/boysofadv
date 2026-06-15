import { inArray } from "drizzle-orm";
import { BUILD_STATUSES, type BuildStatus } from "@/lib/constants/build";
import { db } from "@/db/db";
import { galleryImages } from "@/db/schema";
import { searchBuilds } from "@/lib/db/build-search";

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
  const result = await searchBuilds({
    query: search,
    status:
      status && Object.values(BUILD_STATUSES).includes(status)
        ? status
        : undefined,
    limit,
    offset: cursor ? Number(cursor) || 0 : 0,
    model,
    concept,
    isFeatured:
      isFeatured === "true" ? true : isFeatured === "false" ? false : null,
  });

  const items = result.items;

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
    nextCursor: result.hasMore
      ? String((cursor ? Number(cursor) || 0 : 0) + limit)
      : null,
  };
}
