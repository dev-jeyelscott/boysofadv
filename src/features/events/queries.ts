import { unstable_cache } from "next/cache";
import { and, asc, desc, eq, gte } from "drizzle-orm";

import { db } from "@/db/db";
import { events } from "@/db/schema";
import { EVENT_STATUSES } from "@/lib/constants/event";
import { isEventStatus } from "@/lib/constants/event";
import {
  hasSearchQuery,
  normalizeSearchQuery,
  searchRank,
  searchVectorMatches,
} from "@/lib/db/search";
import { CACHE_TAGS } from "@/src/lib/cache/keys";
import { PUBLIC_CACHE_REVALIDATE_SECONDS } from "@/src/lib/cache/public-cache";

export async function getUpcomingPublicEvents(limit = 6) {
  const safeLimit = Math.min(Math.max(1, limit), 12);

  return unstable_cache(
    () =>
      db
        .select({
          id: events.id,
          title: events.title,
          description: events.description,
          location: events.location,
          startsAt: events.startsAt,
          posterImageUrl: events.posterImageUrl,
        })
        .from(events)
        .where(
          and(
            eq(events.status, EVENT_STATUSES.PUBLISHED),
            gte(events.startsAt, new Date()),
          ),
        )
        .orderBy(asc(events.startsAt))
        .limit(safeLimit),
    [`${CACHE_TAGS.publicEventsUpcoming}:limit:${safeLimit}`],
    {
      tags: [CACHE_TAGS.publicEventsUpcoming],
      revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS.upcomingEvents,
    },
  )();
}

export async function getRecentPublicEvents(limit = 3) {
  const safeLimit = Math.min(Math.max(1, limit), 6);

  return unstable_cache(
    () =>
      db
        .select({
          id: events.id,
          title: events.title,
          description: events.description,
          startsAt: events.startsAt,
        })
        .from(events)
        .where(eq(events.status, EVENT_STATUSES.PUBLISHED))
        .orderBy(desc(events.startsAt))
        .limit(safeLimit),
    [`${CACHE_TAGS.publicEventsUpcoming}:recent:${safeLimit}`],
    {
      tags: [CACHE_TAGS.publicEventsUpcoming],
      revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS.upcomingEvents,
    },
  )();
}

export async function getAdminEvents({
  search,
  status,
  limit = 50,
}: {
  search?: string;
  status?: string;
  limit?: number;
}) {
  const q = hasSearchQuery(search) ? normalizeSearchQuery(search ?? "") : "";
  const rank = q ? searchRank(events.searchVector, "english", q) : undefined;
  const statusParam = status?.trim() || "all";
  const safeStatus = isEventStatus(statusParam) ? statusParam : "all";
  const safeLimit = Math.min(Math.max(1, limit), 100);

  return db
    .select({
      id: events.id,
      title: events.title,
      description: events.description,
      location: events.location,
      latitude: events.latitude,
      longitude: events.longitude,
      geoRadiusMeters: events.geoRadiusMeters,
      startsAt: events.startsAt,
      endsAt: events.endsAt,
      status: events.status,
      posterImageUrl: events.posterImageUrl,
      posterImageKey: events.posterImageKey,
      createdAt: events.createdAt,
    })
    .from(events)
    .where(
      and(
        q ? searchVectorMatches(events.searchVector, "english", q) : undefined,
        safeStatus !== "all" ? eq(events.status, safeStatus) : undefined,
      ),
    )
    .orderBy(
      ...(rank ? [desc(rank), asc(events.startsAt)] : [desc(events.startsAt)]),
    )
    .limit(safeLimit);
}
