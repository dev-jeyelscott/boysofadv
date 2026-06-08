import AdminPageShell from "@/components/admin/admin-page-shell";

const events = [
  {
    title: "Boys of ADV Breakfast Ride",
    date: "June 30, 2026",
    location: "Tagaytay",
    status: "upcoming",
  },
  {
    title: "ADV Night Meet",
    date: "July 12, 2026",
    location: "Manila",
    status: "planning",
  },
];

export default function EventsPage() {
  return (
    <AdminPageShell
      title="Events"
      description="Manage rides, meetups, and community gatherings."
    >
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-black uppercase text-white">
            Event Calendar
          </h2>

          <button className="rounded-full bg-red-600 px-5 py-3 text-sm font-black uppercase text-white hover:bg-red-500">
            Add Event
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.title}
              className="overflow-hidden rounded-2xl border border-white/10 bg-black/40"
            >
              <div className="aspect-video bg-gradient-to-br from-neutral-900 via-black to-red-950" />

              <div className="p-5">
                <span className="rounded-full bg-red-600/20 px-3 py-1 text-xs font-black uppercase text-red-400">
                  {event.status}
                </span>

                <h3 className="mt-4 text-lg font-black uppercase text-white">
                  {event.title}
                </h3>

                <p className="mt-2 text-sm text-white/50">{event.date}</p>
                <p className="mt-1 text-sm text-white/50">{event.location}</p>

                <button className="mt-5 rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase text-white hover:bg-white/10">
                  Manage Event
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminPageShell>
  );
}
