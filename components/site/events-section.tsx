export function EventsSection() {
  return (
    <section id="events" className="relative overflow-hidden bg-black py-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="border border-white/10 bg-neutral-950/80 p-8 md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Upcoming Meet & Greet
          </p>

          <h2 className="mt-4 text-4xl font-black uppercase text-white">
            Ride. Park. <span className="text-red-500">Connect.</span>
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            Join the next Boys of ADV meet and greet. Connect with fellow ADV
            riders, showcase your build, meet partners, and strengthen the
            brotherhood.
          </p>

          <div className="mt-8 grid gap-4 text-sm text-white/70 md:grid-cols-3">
            <div className="rounded-2xl bg-white/4 border border-red-500 p-5">
              <span className="block font-bold text-white">Date</span>
              To be announced
            </div>

            <div className="rounded-2xl bg-white/4 border border-red-500 p-5">
              <span className="block font-bold text-white">Location</span>
              To be announced
            </div>

            <div className="rounded-2xl bg-white/4 border border-red-500 p-5">
              <span className="block font-bold text-white">Riders</span>
              Honda ADV 150 / 160
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
