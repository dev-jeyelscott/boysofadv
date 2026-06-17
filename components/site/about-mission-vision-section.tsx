import { Users, Flag, Handshake, Route, Target, Eye } from "lucide-react";

import { getHomepageStats } from "@/src/features/dashboard/queries";

export async function AboutMissionVisionSection() {
  const stats = await getHomepageStats();

  return (
    <section id="about" className="bg-black py-6 sm:py-10">
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-b from-neutral-950 to-black sm:rounded-3xl">
          {/* Stats */}
          <div className="grid grid-cols-1 border-b border-red-500/20 sm:grid-cols-2 lg:grid-cols-4">
            <StatItem
              icon={<Users />}
              value={stats.approvedMembers}
              label="Approved Members"
            />
            <StatItem
              icon={<Flag />}
              value={stats.publishedBuilds}
              label="Published Builds"
            />
            <StatItem
              icon={<Handshake />}
              value={stats.activePartners}
              label="Active Partners"
            />
            <StatItem
              icon={<Route />}
              value={stats.officialEvents}
              label="Official Events"
            />
          </div>

          {/* Content */}
          <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[2fr_1fr_1fr] lg:gap-10">
            {/* About */}
            <div>
              <h2 className="mb-5 text-center text-2xl font-black uppercase leading-tight text-white sm:text-3xl lg:text-left">
                About <span className="text-red-500">Boys of ADV</span>
              </h2>

              <div className="space-y-4 text-center text-sm leading-relaxed text-white/70 sm:text-base lg:text-left">
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

              <div className="flex justify-center lg:justify-start">
                <button className="mt-6 inline-flex -skew-x-12 items-center gap-3 bg-red-700 px-6 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:bg-red-600 sm:px-7 sm:text-sm">
                  More About Us
                </button>
              </div>
            </div>

            {/* Mission */}
            <InfoBlock
              icon={<Target className="h-6 w-6 text-red-500" />}
              title="Mission"
            >
              To unite Honda ADV riders through camaraderie, organized events,
              meaningful rides, and the promotion of safety, respect, loyalty,
              and brotherhood.
            </InfoBlock>

            {/* Vision */}
            <InfoBlock
              icon={<Eye className="h-6 w-6 text-red-500" />}
              title="Vision"
            >
              To become the leading Honda ADV community recognized for unity,
              integrity, passion, and excellence in motorcycle culture.
            </InfoBlock>
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
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center justify-center gap-4 border-b border-red-500/20 p-5 text-center last:border-b-0 sm:border-r sm:p-6 sm:nth-[2n]:border-r-0 sm:nth-[3]:border-b-0 lg:border-b-0 lg:nth-[2n]:border-r lg:last:border-r-0">
      <div className="shrink-0 text-red-500 [&_svg]:h-6 [&_svg]:w-6">
        {icon}
      </div>

      <div>
        <div className="text-3xl font-black text-white sm:text-4xl">
          {value}
        </div>

        <div className="text-[10px] uppercase tracking-widest text-white/50 sm:text-xs">
          {label}
        </div>
      </div>
    </div>
  );
}

function InfoBlock({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-white/[0.03] p-5 text-center sm:p-6 lg:border-l lg:border-t-0 lg:bg-transparent lg:pl-6 lg:text-left">
      <div className="mb-4 flex items-center justify-center gap-3 lg:justify-start">
        {icon}

        <h3 className="text-lg font-black uppercase text-red-500 sm:text-xl">
          {title}
        </h3>
      </div>

      <p className="text-sm leading-relaxed text-white/70 sm:text-base">
        {children}
      </p>
    </div>
  );
}
