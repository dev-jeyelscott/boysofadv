import Image from "next/image";

import { EventStatusBadge } from "@/components/events/event-status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { EventActionsMenu } from "./event-actions-menu";
import { EventRow } from "@/lib/constants/event";
import { getEventDisplayStatus } from "@/lib/events/display-status";

type Props = {
  events: EventRow[];
};

function formatDate(value: Date | string | null) {
  if (!value) return "No end date";

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function EventsTable({ events }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
      {/* Mobile */}
      <div className="divide-y divide-white/10 md:hidden">
        {events.length === 0 ? (
          <div className="p-8 text-center text-sm text-white/50">
            No events found.
          </div>
        ) : (
          events.map((event) => {
            const displayStatus = getEventDisplayStatus(event);

            return (
              <div key={event.id} className="flex items-start gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <EventStatusBadge
                      status={displayStatus}
                      className="rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase"
                    />
                  </div>

                  <p className="line-clamp-2 text-sm font-black uppercase leading-snug text-white">
                    {event.title}
                  </p>

                  <p className="mt-1 line-clamp-1 text-xs text-white/50">
                    {event.location || "No location"}
                  </p>
                </div>

                <div className="shrink-0">
                  <EventActionsMenu event={event} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop / Tablet */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="w-27.5 p-4 text-xs font-black uppercase tracking-widest text-white/50">
                Poster
              </TableHead>
              <TableHead className="p-4 text-xs font-black uppercase tracking-widest text-white/50">
                Event
              </TableHead>
              <TableHead className="p-4 text-xs font-black uppercase tracking-widest text-white/50">
                Date
              </TableHead>
              <TableHead className="p-4 text-xs font-black uppercase tracking-widest text-white/50">
                Status
              </TableHead>
              <TableHead className="p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {events.length === 0 ? (
              <TableRow className="border-white/10">
                <TableCell
                  colSpan={5}
                  className="p-8 text-center text-white/50"
                >
                  No events found.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => {
                const displayStatus = getEventDisplayStatus(event);

                return (
                  <TableRow
                    key={event.id}
                    className="border-white/10 align-top hover:bg-white/3"
                  >
                    <TableCell className="p-4">
                      <div className="relative aspect-video w-24 overflow-hidden rounded-xl border border-white/10 bg-linear-to-br from-neutral-900 via-black to-red-950">
                        {event.posterImageUrl ? (
                          <Image
                            src={event.posterImageUrl}
                            alt={event.title}
                            fill
                            loading="lazy"
                            quality={75}
                            sizes="100px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                    </TableCell>

                    <TableCell className="max-w-md p-4">
                      <p className="font-black uppercase text-white">
                        {event.title}
                      </p>
                      <p className="mt-1 text-sm text-white/50">
                        {event.location || "No location"}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-white/70">
                        {event.description || "No description"}
                      </p>
                    </TableCell>

                    <TableCell className="p-4 text-sm text-white/60">
                      {formatDate(event.startsAt)}
                    </TableCell>

                    <TableCell className="p-4">
                      <EventStatusBadge
                        status={displayStatus}
                        className="rounded-full border px-3 py-1 font-black uppercase"
                      />
                    </TableCell>

                    <TableCell className="p-4 text-center">
                      <EventActionsMenu event={event} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
