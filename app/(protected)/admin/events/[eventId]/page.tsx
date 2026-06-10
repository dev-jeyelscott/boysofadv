import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ListChecks,
  MapPin,
  Pencil,
} from "lucide-react";
import { eq } from "drizzle-orm";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/db/db";
import { events } from "@/db/schema";

type Props = {
  params: Promise<{
    eventId: string;
  }>;
};

function formatDate(date?: Date | string | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(date));
}

function getStatusClass(status?: string | null) {
  switch (status) {
    case "upcoming":
      return "border-blue-500/30 bg-blue-500/10 text-blue-300";
    case "completed":
      return "border-green-500/30 bg-green-500/10 text-green-300";
    case "cancelled":
      return "border-red-500/30 bg-red-500/10 text-red-300";
    default:
      return "border-white/10 bg-white/10 text-white/70";
  }
}

export default async function AdminEventViewPage({ params }: Props) {
  const { eventId } = await params;

  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (!event) {
    notFound();
  }

  return (
    <section>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          asChild
          variant="outline"
          className="w-fit border-white/10 bg-white/3 text-white hover:bg-white/10 hover:text-white"
        >
          <Link href="/admin/events">
            <ArrowLeft className="mr-2 size-4" />
            Back to Events
          </Link>
        </Button>

        <div className="flex gap-2">
          <Button
            asChild
            className="w-fit rounded-full bg-none px-4 border-white/50 font-black uppercase hover:bg-white/20 hover:border-white/70"
          >
            <Link href={`/admin/events/${event.id}/attendance`}>
              <ListChecks className="mr-2 size-4" />
              Attendance
            </Link>
          </Button>
          <Button
            asChild
            className="w-fit rounded-full bg-red-600 px-4 font-black uppercase text-white hover:bg-red-500"
          >
            <Link href={`/admin/events/${event.id}/edit`}>
              <Pencil className="mr-1 size-4" />
              Edit Event
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:h-[calc(100vh-180px)] lg:grid-cols-[420px_1fr]">
        <div className="overflow-hidden rounded-3xl border border-white/10 lg:sticky lg:top-0 lg:h-full">
          <Image
            src={event.posterImageUrl || "/images/event-placeholder.jpg"}
            alt={event.title}
            width={800}
            height={1200}
            className="h-auto w-full object-contain lg:h-full lg:object-cover"
          />
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/4 p-6 lg:overflow-y-auto no-scrollbar">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge
              className={`${getStatusClass(
                event.status,
              )} rounded-full px-4 py-1 text-xs font-black uppercase tracking-widest`}
            >
              {event.status || "Draft"}
            </Badge>
          </div>

          <h1 className="text-3xl font-black uppercase leading-tight text-white sm:text-4xl">
            {event.title}
          </h1>

          <div className="mt-6 grid gap-4 text-sm text-white/70">
            <div className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
              <CalendarDays className="mt-0.5 size-5 shrink-0 text-red-400" />
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-white/40">
                  Start Date
                </p>
                <p className="mt-1 font-semibold text-white">
                  {formatDate(event.startDate)}
                </p>
              </div>
            </div>

            <div className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
              <MapPin className="mt-0.5 size-5 shrink-0 text-red-400" />
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-white/40">
                  Location
                </p>
                <p className="mt-1 font-semibold text-white">
                  {event.location || "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-black uppercase tracking-widest text-white/40">
              Description
            </p>

            <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-white/70">
              {event.description ? (
                <p className="whitespace-pre-line">{event.description}</p>
              ) : (
                <p>—</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
