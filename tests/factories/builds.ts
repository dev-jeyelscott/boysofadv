import { randomUUID } from "crypto";

import { BUILD_STATUSES } from "@/lib/constants/build";

export function createBuild(overrides = {}) {
  const id = randomUUID();

  return {
    id,
    userId: randomUUID(),
    title: "ADV 160 Touring",
    slug: `adv-160-touring-${id}`,
    motorcycleModel: "ADV 160",
    coverImageUrl: "https://example.com/cover.jpg",
    status: BUILD_STATUSES.DRAFT,
    ...overrides,
  };
}

export function createSubmittedBuild(overrides = {}) {
  return createBuild({
    status: BUILD_STATUSES.FOR_REVIEW,
    submittedAt: new Date(),
    ...overrides,
  });
}

export function createPublishedBuild(overrides = {}) {
  return createBuild({
    status: BUILD_STATUSES.PUBLISHED,
    submittedAt: new Date(),
    publishedAt: new Date(),
    ...overrides,
  });
}
