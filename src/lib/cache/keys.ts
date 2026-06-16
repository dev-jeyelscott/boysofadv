export const CACHE_TAGS = {
  homepageStats: "homepage:stats",
  homepageFeaturedBuilds: "homepage:featured-builds",
  publicPartnersActive: "public:partners:active",
  publicEventsUpcoming: "public:events:upcoming",
  publicBuilds: "public:builds",
  adminDashboard: "admin:dashboard",
} as const;

export function publicBuildsPageCacheKey(page: number, limit: number) {
  return `public:builds:page:${page}:limit:${limit}`;
}
