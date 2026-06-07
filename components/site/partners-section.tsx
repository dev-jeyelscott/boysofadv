const partners = [
  { name: "Chill Ride", logo: "/images/partners/chill-ride.png" },
  { name: "Moditech", logo: "/images/partners/moditech.png" },
  { name: "RS1 Moto District", logo: "/images/partners/rs1.png" },
  { name: "Freedconn", logo: "/images/partners/freedconn.png" },
  { name: "Uma Racing", logo: "/images/partners/uma.png" },
  { name: "RCB", logo: "/images/partners/rcb.png" },
];

export function PartnersSection() {
  return (
    <section id="partners" className="relative overflow-hidden py-10 bg-black py-6">
      <div className="mx-auto max-w-7xl px-4 my-10">
        {/* Header */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-red-600/40" />
            <h2 className="text-center text-3xl font-black uppercase tracking-wider italic text-white">
              Official <span className="text-red-500">Partners</span>
            </h2>
            <div className="h-px flex-1 bg-red-600/40" />
          </div>
        {/* Partner Logos */}
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-3">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex h-40 items-center justify-center rounded-sm border border-white/10 bg-neutral-950/80 px-5 transition hover:border-red-600/70 hover:bg-red-950/20"
            >
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                className="max-h-30 max-w-full object-contain"
              />
            </div>
          ))}
        </div>

        {/* Mobile Button */}
        <div className="mt-5 flex justify-center">
          <button className="hidden items-center gap-2 rounded-sm border border-red-700/70 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-red-700 sm:flex">
            View All Partners
            <span className="text-red-500">›</span>
          </button>
        </div>
        <div className="mt-5 flex justify-center sm:hidden">
          <button className="rounded-sm border border-red-700/70 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-red-700">
            View All Partners <span className="text-red-500">›</span>
          </button>
        </div>
      </div>
    </section>
  );
}