import { EventCreateDialog } from "@/components/admin/events/event-create-dialog";
import { EventsFilters } from "@/components/admin/events/events-filter";
import { EventsTable } from "@/components/admin/events/events-table";
import { getAdminEvents } from "@/src/features/events/queries";

type Props = {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
};

export default async function EventsPage({ searchParams }: Props) {
  const params = await searchParams;
  const eventRows = await getAdminEvents({
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
        <EventsTable events={eventRows} />
      </div>
    </div>
  );
}
