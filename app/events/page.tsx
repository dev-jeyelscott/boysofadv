import { CalendarDays, MapPin } from "lucide-react";
import { desc } from "drizzle-orm";

import { SiteHeader } from "@/components/site/site-header";
import { db } from "@/db/db";
import { events } from "@/db/schema";

export default async function EventsPage() {
  const eventList = await db
    .select()
    .from(events)
    .orderBy(desc(events.createdAt));

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
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center">
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
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-red-600/50 hover:bg-white/[0.07]"
                >
                  <div className="mb-5 inline-flex rounded-full border border-red-600/40 bg-red-600/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-red-400">
                    Event
                  </div>

                  <h2 className="text-2xl font-black uppercase leading-tight">
                    {event.title}
                  </h2>

                  {event.description ? (
                    <p className="mt-4 line-clamp-4 text-sm leading-7 text-white/60">
                      {event.description}
                    </p>
                  ) : null}

                  <div className="mt-6 grid gap-3 text-sm text-white/60">
                    {event.startDate ? (
                      <div className="flex items-center gap-3">
                        <CalendarDays className="size-4 text-red-500" />
                        <span>
                          {new Intl.DateTimeFormat("en-PH", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }).format(event.startDate)}
                        </span>
                      </div>
                    ) : null}

                    {event.location ? (
                      <div className="flex items-center gap-3">
                        <MapPin className="size-4 text-red-500" />
                        <span>{event.location}</span>
                      </div>
                    ) : null}
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
