"use client";

import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { loadMoreAdminEvents } from "@/app/(protected)/admin/events/actions";
import { EventsTable } from "@/components/admin/events/events-table";
import { type EventRow } from "@/lib/constants/event";

type Props = {
  events: EventRow[];
  nextCursor: string | null;
  hasMore: boolean;
  filters: {
    search?: string;
    status?: string;
  };
};

export function AdminEventsClient({
  events: initialEvents,
  nextCursor: initialNextCursor,
  hasMore: initialHasMore,
  filters,
}: Props) {
  const [events, setEvents] = useState(initialEvents);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);

  async function loadMoreEvents() {
    if (!nextCursor) {
      setHasMore(false);
      return;
    }

    const result = await loadMoreAdminEvents({
      ...filters,
      cursor: nextCursor,
    });

    setEvents((current) => [...current, ...result.events]);
    setNextCursor(result.nextCursor);
    setHasMore(result.hasMore);
  }

  return (
    <InfiniteScroll
      dataLength={events.length}
      next={loadMoreEvents}
      hasMore={hasMore}
      scrollThreshold={0.85}
      loader={<AdminTableLoader label="Loading more events..." />}
      endMessage={
        events.length > 0 ? (
          <AdminTableEndMessage label="No more events to load" />
        ) : null
      }
    >
      <EventsTable events={events} />
    </InfiniteScroll>
  );
}

function AdminTableLoader({ label }: { label: string }) {
  return (
    <div className="py-8 text-center text-xs font-black uppercase tracking-[0.3em] text-white/70">
      {label}
    </div>
  );
}

function AdminTableEndMessage({ label }: { label: string }) {
  return (
    <div className="py-8 text-center text-xs font-black uppercase tracking-[0.3em] text-white/30">
      {label}
    </div>
  );
}
