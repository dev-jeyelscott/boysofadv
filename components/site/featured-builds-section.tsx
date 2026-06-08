// components/featured-builds-section.tsx
import { desc, eq } from "drizzle-orm";

import { db } from "@/db/db";
import { builds, users } from "@/db/schema";
import { FeaturedBuildsCarousel } from "./featured-builds-carousel";

export async function FeaturedBuildsSection() {
  const featuredBuilds = await db
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
    })
    .from(builds)
    .leftJoin(users, eq(builds.userId, users.id))
    .where(eq(builds.isFeatured, true))
    .orderBy(desc(builds.createdAt))
    .limit(10);

  const carouselBuilds = featuredBuilds.map((build) => ({
    id: build.id,
    title: build.title || build.motorcycleModel || "Untitled Build",
    owner:
      build.ownerNickname ||
      `${build.ownerFirstName || ""} ${build.ownerLastName || ""}`.trim() ||
      "Boys of ADV Member",
    image: build.coverImageUrl || "/images/build-placeholder.jpg",
    mods: [
      build.motorcycleModel,
      build.concept,
      build.description,
    ].filter((mod): mod is string => Boolean(mod)),
  }));

  return <FeaturedBuildsCarousel builds={carouselBuilds} />;
}