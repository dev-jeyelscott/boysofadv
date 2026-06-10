import { desc, eq, or } from "drizzle-orm";
import Link from "next/link";

import { db } from "@/db/db";
import { events } from "@/db/schema";

function formatEventDate(date: Date | string | null) {
  if (!date) return "TBA";

  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export async function EventsSection() {
  const recentEvents = await db.query.events.findMany({
    where: or(eq(events.status, "published"), eq(events.status, "completed")),
    orderBy: [desc(events.startDate)],
    limit: 3,
  });

  if (recentEvents.length === 0) {
    return null;
  }

  return (
    <section
      id="events"
      className="relative overflow-hidden bg-black px-4 py-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-red-500">
            Recent Events
          </p>

          <h2 className="mt-3 text-3xl font-black uppercase text-white sm:text-4xl">
            Community <span className="text-red-500">Events</span>
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
            See the latest Boys of ADV rides, meetups, and community gatherings.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recentEvents.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="group rounded-3xl border border-white/10 bg-neutral-950/80 p-5 transition-all hover:border-red-500/50"
            >
              <div className="mb-4 inline-flex rounded-full bg-red-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-red-500">
                Event
              </div>

              <h3 className="line-clamp-2 text-xl font-black uppercase text-white">
                {event.title}
              </h3>

              {event.description && (
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/70">
                  {event.description}
                </p>
              )}

              <div className="mt-6 border-t border-white/10 pt-4">
                <span className="block text-xs font-black uppercase tracking-widest text-white/40">
                  Event Date
                </span>

                <span className="text-sm font-semibold text-white">
                  {formatEventDate(event.startDate)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
