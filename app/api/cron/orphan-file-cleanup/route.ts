import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

import { db } from "@/db/db";
import { builds, events, galleryImages, partners } from "@/db/schema";

export const runtime = "nodejs";

const utapi = new UTApi();

const ORPHAN_FILE_GRACE_PERIOD_DAYS = 7;
const ORPHAN_FILE_GRACE_PERIOD_MS =
  ORPHAN_FILE_GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000;

function getUploadThingKey(value: string | null | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.pathname.split("/").filter(Boolean).pop() ?? null;
  } catch {
    return value.split("/").filter(Boolean).pop() ?? null;
  }
}

async function getReferencedFileKeys() {
  const referencedKeys = new Set<string>();

  const buildRows = await db
    .select({
      coverImage: builds.coverImageUrl,
    })
    .from(builds);

  for (const build of buildRows) {
    const coverKey = getUploadThingKey(build.coverImage);
    if (coverKey) referencedKeys.add(coverKey);
  }

  const galleryRows = await db
    .select({
      imageUrl: galleryImages.imageUrl,
    })
    .from(galleryImages);

  for (const image of galleryRows) {
    const imageKey = getUploadThingKey(image.imageUrl);
    if (imageKey) referencedKeys.add(imageKey);
  }

  const eventRows = await db
    .select({
      posterImage: events.posterImageUrl,
    })
    .from(events);

  for (const event of eventRows) {
    const posterKey = getUploadThingKey(event.posterImage);
    if (posterKey) referencedKeys.add(posterKey);
  }

  const partnerRows = await db
    .select({
      logoImage: partners.logoUrl,
    })
    .from(partners);

  for (const partner of partnerRows) {
    const logoKey = getUploadThingKey(partner.logoImage);
    if (logoKey) referencedKeys.add(logoKey);
  }

  return referencedKeys;
}

function isPastGracePeriod(uploadedAt: number) {
  return Date.now() - uploadedAt >= ORPHAN_FILE_GRACE_PERIOD_MS;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const referencedKeys = await getReferencedFileKeys();

  const orphanKeys: string[] = [];
  const skippedRecentKeys: string[] = [];

  const limit = 500;
  let offset = 0;

  while (true) {
    const result = await utapi.listFiles({
      limit,
      offset,
    });

    if (!result.files.length) break;

    for (const file of result.files) {
      if (file.status !== "Uploaded") continue;

      if (referencedKeys.has(file.key)) continue;

      if (!isPastGracePeriod(file.uploadedAt)) {
        skippedRecentKeys.push(file.key);
        continue;
      }

      orphanKeys.push(file.key);
    }

    if (!result.hasMore) break;

    offset += limit;
  }

  const deletedKeys: string[] = [];
  const failedKeys: string[] = [];

  for (let i = 0; i < orphanKeys.length; i += 50) {
    const batch = orphanKeys.slice(i, i + 50);

    try {
      await utapi.deleteFiles(batch);
      deletedKeys.push(...batch);
    } catch {
      failedKeys.push(...batch);
    }
  }

  return NextResponse.json({
    gracePeriodDays: ORPHAN_FILE_GRACE_PERIOD_DAYS,
    scannedReferencedFiles: referencedKeys.size,
    orphanFilesFound: orphanKeys.length,
    skippedRecentFiles: skippedRecentKeys.length,
    deleted: deletedKeys.length,
    failed: failedKeys.length,
    deletedKeys,
    failedKeys,
    skippedRecentKeys,
  });
}
