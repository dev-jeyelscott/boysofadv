import { revalidateTag } from "next/cache";

import { CACHE_TAGS } from "./keys";

function expireTag(tag: string) {
  revalidateTag(tag, "max");
}

export function revalidateBuildCaches() {
  expireTag(CACHE_TAGS.homepageFeaturedBuilds);
  expireTag(CACHE_TAGS.publicBuilds);
  expireTag(CACHE_TAGS.homepageStats);
  expireTag(CACHE_TAGS.adminDashboard);
}

export function revalidatePartnerCaches() {
  expireTag(CACHE_TAGS.publicPartnersActive);
  expireTag(CACHE_TAGS.homepageStats);
  expireTag(CACHE_TAGS.adminDashboard);
}

export function revalidateEventCaches() {
  expireTag(CACHE_TAGS.publicEventsUpcoming);
  expireTag(CACHE_TAGS.homepageStats);
  expireTag(CACHE_TAGS.adminDashboard);
}

export function revalidateMemberCaches() {
  expireTag(CACHE_TAGS.homepageStats);
  expireTag(CACHE_TAGS.adminDashboard);
}
