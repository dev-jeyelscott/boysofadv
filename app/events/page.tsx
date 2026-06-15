import { CalendarDays, MapPin } from "lucide-react";
import { desc } from "drizzle-orm";

import { SiteHeader } from "@/components/site/site-header";
import { db } from "@/db/db";
import { events } from "@/db/schema";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function EventsPage() {
  const eventList = await db
    .select({
      id: events.id,
      title: events.title,
      location: events.location,
      startsAt: events.startsAt,
      posterImageUrl: events.posterImageUrl,
    })
    .from(events)
    .orderBy(desc(events.startsAt));

  return (
    <main className="min-h-screen bg-black text-white">
      <SiteHeader />

      <section className="relative overflow-hidden px-4 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.18),transparent_35%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-red-600/40" />
            <h1 className="text-center text-3xl font-black uppercase tracking-tight md:text-5xl">
              Events
            </h1>
            <div className="h-px flex-1 bg-red-600/40" />
          </div>

          <p className="mx-auto mb-12 max-w-2xl text-center text-sm leading-7 text-white/60 md:text-base">
            Ride-outs, meetups, community activities, and official Boys of ADV
            gatherings.
          </p>

          {eventList.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/4 p-10 text-center">
              <h2 className="text-xl font-black uppercase">
                No Events Available
              </h2>
              <p className="mt-3 text-sm text-white/50">
                Upcoming events will be posted here soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {eventList.map((event) => (
                <article
                  key={event.id}
                  className="hover:shadow-2xl hover:shadow-red-900/20 group overflow-hidden rounded-2xl border border-white/10 bg-white/4 transition-all duration-300 ease-out hover:scale-105 hover:border-red-600/50 hover:bg-white/[0.07]"
                >
                  <div>
                    <div className="relative aspect-4/3 overflow-hidden bg-white/5 sm:aspect-16/10">
                      <Image
                        src={
                          event.posterImageUrl ||
                          "/images/event-placeholder.jpg"
                        }
                        alt={event.title}
                        fill
                        loading="lazy"
                        quality={75}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover "
                      />
                    </div>

                    <div className="flex min-h-57.5 flex-col p-4 sm:p-5 lg:p-6">
                      <h2 className="line-clamp-2 text-xl font-black uppercase leading-tight sm:text-2xl">
                        {event.title}
                      </h2>

                      <div className="mt-4 grid gap-3 text-sm text-white/60">
                        {event.startsAt ? (
                          <div className="flex items-start gap-3">
                            <CalendarDays className="mt-0.5 size-4 shrink-0 text-red-500" />
                            <span>
                              {new Intl.DateTimeFormat("en-PH", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }).format(new Date(event.startsAt))}
                            </span>
                          </div>
                        ) : null}

                        {event.location ? (
                          <div className="flex items-start gap-3">
                            <MapPin className="mt-0.5 size-4 shrink-0 text-red-500" />
                            <span className="line-clamp-2">
                              {event.location}
                            </span>
                          </div>
                        ) : null}
                      </div>

                      <Button
                        asChild
                        className="mt-auto w-full items-center font-bold
                      uppercase tracking-wider text-white transition
                      hover:bg-red-700 sm:flex -skew-x-12 gap-2 border border-red-700/70 rounded-sm text-xs sm:text-sm"
                      >
                        {/* hidden items-center -skew-x-12 gap-2 rounded-sm border
                      border-red-700/70 px-4 py-2 text-[10px] font-bold
                      uppercase tracking-wider text-white transition
                      hover:bg-red-700 sm:flex */}
                        <Link href={`/events/${event.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
