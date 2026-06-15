import { and, asc, desc, eq } from "drizzle-orm";

import { db } from "@/db/db";
import { events } from "@/db/schema";
import { EventCreateDialog } from "@/components/admin/events/event-create-dialog";
import { EventsFilters } from "@/components/admin/events/events-filter";
import { EventsTable } from "@/components/admin/events/events-table";
import { isEventStatus } from "@/lib/constants/event";
import {
  hasSearchQuery,
  normalizeSearchQuery,
  searchRank,
  searchVectorMatches,
} from "@/lib/db/search";

type Props = {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
};

export default async function EventsPage({ searchParams }: Props) {
  const params = await searchParams;

  const q = hasSearchQuery(params.q)
    ? normalizeSearchQuery(params.q ?? "")
    : "";
  const rank = q ? searchRank(events.searchVector, "english", q) : undefined;

  const statusParam = params.status?.trim() || "all";
  const status = isEventStatus(statusParam) ? statusParam : "all";

  const eventRows = await db
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
        status !== "all" ? eq(events.status, status) : undefined,
      ),
    )
    .orderBy(
      ...(rank ? [desc(rank), asc(events.startsAt)] : [desc(events.startsAt)]),
    );

  return (
    <div className="space-y-6">
      <EventsFilters />

      <div className="flex justify-end px-4 py-2">
        <EventCreateDialog />
      </div>

      <div className="mt-5">
        <EventsTable events={eventRows} />
      </div>
    </div>
  );
}
