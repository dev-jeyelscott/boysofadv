import { and, desc, eq, ilike, or } from "drizzle-orm";

import { db } from "@/db/db";
import { events } from "@/db/schema";
import { EventCreateDialog } from "@/components/admin/events/event-create-dialog";
import { EventsFilters } from "@/components/admin/events/events-filter";
import { EventsTable } from "@/components/admin/events/events-table";
import { EVENT_STATUSES } from "@/lib/constants/event";

type Props = {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
};

type EventStatus = (typeof EVENT_STATUSES)[number];

function isEventStatus(value: string): value is EventStatus {
  return EVENT_STATUSES.includes(value as EventStatus);
}

export default async function EventsPage({ searchParams }: Props) {
  const params = await searchParams;

  const q = params.q?.trim() || "";

  const statusParam = params.status?.trim() || "all";
  const status = isEventStatus(statusParam) ? statusParam : "all";

  const eventRows = await db
    .select({
      id: events.id,
      title: events.title,
      description: events.description,
      location: events.location,
      startDate: events.startDate,
      endDate: events.endDate,
      status: events.status,
      posterImageUrl: events.posterImageUrl,
      posterImageKey: events.posterImageKey,
      createdAt: events.createdAt,
    })
    .from(events)
    .where(
      and(
        q
          ? or(
              ilike(events.title, `%${q}%`),
              ilike(events.location, `%${q}%`),
              ilike(events.description, `%${q}%`),
            )
          : undefined,
        status !== "all" ? eq(events.status, status) : undefined,
      ),
    )
    .orderBy(desc(events.startDate));

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
