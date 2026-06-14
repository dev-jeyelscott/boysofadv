import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";

import { db } from "@/db/db";
import { builds, buildLikes, buildComments } from "@/db/schema";

export const runtime = "nodejs";

function calculateRecencyBoost(publishedAt: Date | null) {
  if (!publishedAt) return 0;

  const now = Date.now();
  const ageInDays = Math.floor(
    (now - publishedAt.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (ageInDays <= 7) return 40;
  if (ageInDays <= 30) return 25;
  if (ageInDays <= 90) return 10;

  return 0;
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const publishedBuilds = await db
      .select({
        id: builds.id,
        publishedAt: builds.publishedAt,
        isFeatured: builds.isFeatured,

        likesCount: sql<number>`count(distinct ${buildLikes.id})::int`,
        commentsCount: sql<number>`count(distinct ${buildComments.id})::int`,
      })
      .from(builds)
      .leftJoin(buildLikes, eq(buildLikes.buildId, builds.id))
      .leftJoin(buildComments, eq(buildComments.buildId, builds.id))
      .where(eq(builds.status, "published"))
      .groupBy(builds.id);

    const results = [];

    for (const build of publishedBuilds) {
      const likeScore = build.likesCount * 10;
      const commentScore = build.commentsCount * 6;
      const featuredScore = build.isFeatured ? 50 : 0;
      const recencyScore = calculateRecencyBoost(build.publishedAt);

      const popularityScore =
        likeScore + commentScore + featuredScore + recencyScore;

      await db
        .update(builds)
        .set({
          popularityScore,
          popularityCalculatedAt: new Date(),
        })
        .where(eq(builds.id, build.id));

      results.push({
        buildId: build.id,
        likes: build.likesCount,
        comments: build.commentsCount,
        popularityScore,
      });
    }

    return NextResponse.json({
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("[BUILD_POPULARITY_CRON_ERROR]", error);

    return NextResponse.json(
      { error: "Failed to calculate build popularity" },
      { status: 500 },
    );
  }
}
