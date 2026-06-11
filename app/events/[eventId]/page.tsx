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

      <main className="min-h-screen bg-black text-white">
        <section className="mx-auto max-w-6xl px-4 py-4 sm:py-6 lg:py-8">
          <Link
            href="/events"
            className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/50 transition hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to Events
          </Link>

          <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] lg:rounded-3xl">
            <div className="grid gap-0 lg:grid-cols-[420px_1fr]">
              {/* Poster */}
              <div className="border-b border-white/10 bg-black lg:border-b-0 lg:border-r lg:border-white/10">
                <div className="relative aspect-[4/5] w-full bg-neutral-950 sm:aspect-[16/10] lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:aspect-auto">
                  {event.posterImageUrl ? (
                    <Image
                      src={event.posterImageUrl}
                      alt={event.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 420px"
                      className="object-contain p-3 sm:p-4"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-sm font-bold uppercase tracking-widest text-white/30">
                      No Poster Available
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="p-4 sm:p-6 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:p-8">
                <Badge
                  className={`mb-4 border text-[10px] font-black uppercase tracking-widest ${getStatusClasses(
                    status,
                  )}`}
                >
                  {status}
                </Badge>

                <h1 className="text-2xl font-black uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  {event.title}
                </h1>

                <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <CalendarDays className="mt-0.5 size-5 shrink-0 text-red-500" />

                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        Event Date
                      </p>

                      <p className="mt-1 text-sm leading-6 text-white/80">
                        {formatDate(event.startDate)}
                      </p>

                      {event.endDate && (
                        <p className="mt-1 text-sm leading-6 text-white/50">
                          Until {formatDate(event.endDate)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-red-500" />

                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        Location
                      </p>

                      <p className="mt-1 break-words text-sm leading-6 text-white/80">
                        {event.location || "TBA"}
                      </p>
                    </div>
                  </div>
                </div>

                {event.description && (
                  <section className="mt-6 sm:mt-8">
                    <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-red-500 sm:text-base">
                      About This Event
                    </h2>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                      <p className="whitespace-pre-wrap text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
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
