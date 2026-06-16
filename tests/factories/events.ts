import { randomUUID } from "crypto";

import { EVENT_STATUSES } from "@/lib/constants/event";

export function createEvent(overrides = {}) {
  const id = randomUUID();
  const startsAt = new Date(Date.now() + 60 * 60 * 1000);

  return {
    id,
    title: "ADV Sunday Ride",
    slug: `adv-sunday-ride-${id}`,
    description: "Community ride.",
    location: "Manila",
    latitude: "14.5995000",
    longitude: "120.9842000",
    geoRadiusMeters: 100,
    startsAt,
    endsAt: new Date(startsAt.getTime() + 2 * 60 * 60 * 1000),
    status: EVENT_STATUSES.DRAFT,
    ...overrides,
  };
}

export function createPublishedEvent(overrides = {}) {
  return createEvent({
    status: EVENT_STATUSES.PUBLISHED,
    publishedAt: new Date(),
    ...overrides,
  });
}

export function createActiveEvent(overrides = {}) {
  return createPublishedEvent({
    startsAt: new Date(Date.now() - 5 * 60 * 1000),
    endsAt: new Date(Date.now() + 60 * 60 * 1000),
    ...overrides,
  });
}
