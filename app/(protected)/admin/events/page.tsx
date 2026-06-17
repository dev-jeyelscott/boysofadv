import { EventCreateDialog } from "@/components/admin/events/event-create-dialog";
import { EventsFilters } from "@/components/admin/events/events-filter";
import { getAdminEvents } from "@/src/features/events/queries";
import { AdminEventsClient } from "./admin-events-client";

type Props = {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
};

export default async function EventsPage({ searchParams }: Props) {
  const params = await searchParams;
  const eventsData = await getAdminEvents({
    search: params.q,
    status: params.status,
  });

  return (
    <div className="space-y-6">
      <EventsFilters />

      <div className="flex justify-end px-4 py-2">
        <EventCreateDialog />
      </div>

      <div className="mt-5">
        <AdminEventsClient
          key={[params.q, params.status].join(":")}
          events={eventsData.events}
          nextCursor={eventsData.nextCursor}
          hasMore={eventsData.hasMore}
          filters={{
            search: params.q,
            status: params.status,
          }}
        />
      </div>
    </div>
  );
}
