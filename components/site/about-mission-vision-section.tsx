import { Users, Flag, Handshake, Route, Target, Eye } from "lucide-react";

export function AboutMissionVisionSection() {
  return (
    <section id="about" className="bg-black py-6">
      <div className="container mx-auto px-4 my-10">
        <div className="overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-b from-neutral-950 to-black">
          {/* Stats */}
          <div className="grid grid-cols-2 border-b border-red-500/20 md:grid-cols-4">
            <StatItem icon={<Users />} value="150+" label="Official Members" />

            <StatItem icon={<Flag />} value="30+" label="Official Events" />

            <StatItem icon={<Handshake />} value="15+" label="Partner Shops" />

            <StatItem icon={<Route />} value="500+" label="Community Rides" />
          </div>

          {/* Content */}
          <div className="grid gap-10 p-8 md:grid-cols-[2fr_1fr_1fr]">
            {/* About */}
            <div>
              <h2 className="mb-6 text-3xl font-black uppercase">
                About <span className="text-red-500">Boys of ADV</span>
              </h2>

              <div className="space-y-4 text-white/70">
                <p>
                  Boys of ADV is a community of Honda ADV riders united by
                  passion, camaraderie, and the pursuit of building motorcycles
                  that stand out.
                </p>

                <p>
                  We share knowledge, support fellow members, organize rides,
                  and represent the culture of performance, aesthetics, and
                  brotherhood.
                </p>

                <p className="font-bold uppercase text-white">
                  We are <span className="text-red-600">Fearless</span>, not{" "}
                  <span className="text-red-600">reckless</span>.
                </p>
              </div>

              <div className="flex md:justify-start justify-center">
                <button className="mt-6 inline-flex w-fit -skew-x-12 items-center gap-3 bg-red-700 px-7 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-red-600">
                  More About Us
                </button>
              </div>
            </div>

            {/* Mission */}
            <div className="border-l border-red-500/20 pl-6">
              <div className="mb-5 flex items-center gap-3">
                <Target className="h-6 w-6 text-red-500" />

                <h3 className="text-xl font-black uppercase text-red-500">
                  Mission
                </h3>
              </div>

              <p className="leading-relaxed text-white/70">
                To unite Honda ADV riders through camaraderie, organized events,
                meaningful rides, and the promotion of safety, respect, loyalty,
                and brotherhood.
              </p>
            </div>

            {/* Vision */}
            <div className="border-l border-red-500/20 pl-6">
              <div className="mb-5 flex items-center gap-3">
                <Eye className="h-6 w-6 text-red-500" />

                <h3 className="text-xl font-black uppercase text-red-500">
                  Vision
                </h3>
              </div>

              <p className="leading-relaxed text-white/70">
                To become the leading Honda ADV community recognized for unity,
                integrity, passion, and excellence in motorcycle culture.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center justify-center gap-4 border-r border-red-500/20 p-6 last:border-r-0">
      <div className="text-red-500">{icon}</div>

      <div>
        <div className="text-4xl font-black text-white">{value}</div>

        <div className="text-xs uppercase tracking-widest text-white/50">
          {label}
        </div>
      </div>
    </div>
  );
}
