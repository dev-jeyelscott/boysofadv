import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { eq } from "drizzle-orm";

import { SiteHeader } from "@/components/site/site-header";
import { Badge } from "@/components/ui/badge";
import { db } from "@/db/db";
import { events } from "@/db/schema";

type Props = {
  params: Promise<{
    eventId: string;
  }>;
};

function formatDate(date?: Date | string | null) {
  if (!date) return "TBA";

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(date));
}

function getStatus(event: {
  startDate: Date | string | null;
  endDate: Date | string | null;
}) {
  const now = new Date();
  const start = event.startDate ? new Date(event.startDate) : null;
  const end = event.endDate ? new Date(event.endDate) : null;

  if (!start) return "Draft";
  if (start > now) return "Upcoming";
  if (end && end < now) return "Completed";

  return "Ongoing";
}

function getStatusClasses(status: string) {
  switch (status) {
    case "Upcoming":
      return "border-blue-500/30 bg-blue-500/10 text-blue-400";
    case "Ongoing":
      return "border-green-500/30 bg-green-500/10 text-green-400";
    case "Completed":
      return "border-white/20 bg-white/10 text-white";
    default:
      return "border-red-500/30 bg-red-500/10 text-red-400";
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { eventId } = await params;

  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
  });

  if (!event) {
    return {
      title: "Event Not Found | Boys of ADV",
    };
  }

  const title = `${event.title} | Boys of ADV`;
  const description =
    event.description?.slice(0, 160) ||
    "View event details, schedule, location, and updates from Boys of ADV.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: event.posterImageUrl
        ? [
            {
              url: event.posterImageUrl,
              width: 1200,
              height: 630,
              alt: event.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: event.posterImageUrl ? [event.posterImageUrl] : [],
    },
  };
}

export default async function EventDetailsPage({ params }: Props) {
  const { eventId } = await params;

  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
  });

  if (!event) {
    notFound();
  }

  const status = getStatus(event);

  return (
    <>
      <SiteHeader />

      <main className="min-h-75vh bg-black text-white">
        <section className="mx-auto max-w-6xl px-4 py-8 md:py-4">
          <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            <div className="grid h-[80vh] lg:grid-cols-[420px_1fr]">
              {/* LEFT - IMAGE */}
              <div className="border-b border-white/10 bg-black lg:border-b-0 lg:border-r">
                <Link
                  href="/events"
                  className="ml-4 mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white/60 transition hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Events
                </Link>
                <div className="sticky top-0 flex h-full items-center justify-center bg-black p-4">
                  {event.posterImageUrl ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={event.posterImageUrl}
                        alt={event.title}
                        fill
                        priority
                        sizes="420px"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/30">
                      No Poster Available
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT - DETAILS */}
              <div className="no-scrollbar overflow-y-auto p-6 md:p-8">
                <Badge
                  className={`mb-4 border font-black uppercase tracking-wider ${getStatusClasses(
                    status,
                  )}`}
                >
                  {status}
                </Badge>

                <h1 className="text-3xl font-black uppercase leading-tight md:text-5xl">
                  {event.title}
                </h1>

                <div className="mt-6 grid gap-4">
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <CalendarDays className="mt-1 h-5 w-5 shrink-0 text-red-500" />

                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-white/40">
                        Event Date
                      </p>

                      <p className="mt-1 text-sm text-white/80">
                        {formatDate(event.startDate)}
                      </p>

                      {event.endDate && (
                        <p className="text-sm text-white/50">
                          Until {formatDate(event.endDate)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <MapPin className="mt-1 h-5 w-5 shrink-0 text-red-500" />

                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-white/40">
                        Location
                      </p>

                      <p className="mt-1 text-sm text-white/80">
                        {event.location || "TBA"}
                      </p>
                    </div>
                  </div>
                </div>

                {event.description && (
                  <section className="mt-8">
                    <h2 className="mb-4 text-lg text-red-600 font-black uppercase tracking-wide">
                      About This Event
                    </h2>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <p className="whitespace-pre-wrap leading-8 text-white/70">
                        {event.description}
                      </p>
                    </div>
                  </section>
                )}
              </div>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}
