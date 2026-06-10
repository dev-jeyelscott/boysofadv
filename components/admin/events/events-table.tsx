import Image from "next/image";

import { Badge } from "@/components/ui/badge";
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

type Props = {
  events: EventRow[];
};

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusClass(status: string) {
  switch (status) {
    case "upcoming":
      return "bg-red-600/20 text-red-300 border-red-500/20";
    case "ongoing":
      return "bg-emerald-600/20 text-emerald-300 border-emerald-500/20";
    case "completed":
      return "bg-white/10 text-white/70 border-white/10";
    case "cancelled":
      return "bg-zinc-700/40 text-zinc-300 border-white/10";
    default:
      return "bg-yellow-600/20 text-yellow-300 border-yellow-500/20";
  }
}

export function EventsTable({ events }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="w-[110px] p-4 text-xs font-black uppercase tracking-widest text-white/50">
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
              <TableCell colSpan={5} className="p-8 text-center text-white/50">
                No events found.
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => (
              <TableRow
                key={event.id}
                className="border-white/10 align-top hover:bg-white/[0.03]"
              >
                <TableCell className="p-4">
                  <div className="relative aspect-video w-24 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-neutral-900 via-black to-red-950">
                    {event.posterImageUrl ? (
                      <Image
                        src={event.posterImageUrl}
                        alt={event.title}
                        fill
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
                  <p className="mt-2 line-clamp-2 text-sm text-white/40">
                    {event.description || "No description"}
                  </p>
                </TableCell>

                <TableCell className="p-4 text-sm text-white/60">
                  {formatDate(event.startDate)}
                </TableCell>

                <TableCell className="p-4">
                  <Badge
                    className={`${getStatusClass(event.status)} rounded-full border px-3 py-1 font-black uppercase`}
                  >
                    {event.status}
                  </Badge>
                </TableCell>

                <TableCell className="p-4 text-center">
                  <EventActionsMenu event={event} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
