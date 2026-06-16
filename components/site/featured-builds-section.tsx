import { FeaturedBuildsCarousel } from "./featured-builds-carousel";
import { getFeaturedPublicBuilds } from "@/src/features/builds/queries";

export async function FeaturedBuildsSection() {
  const featuredBuilds = await getFeaturedPublicBuilds(10);

  if (featuredBuilds.length === 0) {
    return null;
  }

  const carouselBuilds = featuredBuilds.map((build) => ({
    id: build.id,
    title: build.title || build.motorcycleModel || "Untitled Build",
    owner:
      build.ownerNickname ||
      build.ownerCodename ||
      `${build.ownerFirstName || ""} ${build.ownerLastName || ""}`.trim() ||
      "Boys of ADV Member",
    image: build.coverImageUrl || "/images/build-placeholder.jpg",
    mods: [
      build.motorcycleModel,
      build.concept,
      build.description?.slice(0, 200) + "...",
    ].filter((mod): mod is string => Boolean(mod)),
  }));

  return <FeaturedBuildsCarousel builds={carouselBuilds} />;
}
