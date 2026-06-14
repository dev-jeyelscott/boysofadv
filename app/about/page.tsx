import Image from "next/image";

import { SiteHeader } from "@/components/site/site-header";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.24),transparent_45%)]" />
        <div className="mx-auto grid min-h-130 max-w-7xl items-center gap-10 px-4 py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative z-10">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-red-500">
              About Boys of ADV
            </p>

            <h1 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-7xl">
              Built by riders.
              <span className="block text-red-600">Driven by brotherhood.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 md:text-lg">
              Boys of ADV is a community for Honda ADV riders who value builds,
              rides, discipline, and respect on the road. We bring together
              riders who share the same passion for adventure, performance,
              customization, and responsible motorcycle culture.
            </p>
          </div>

          <div className="relative z-10 overflow-hidden rounded-4xl border border-white/10 bg-white/4 p-3">
            <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-white/5">
              <Image
                src="/images/about/about-hero.webp"
                alt="Boys of ADV riders"
                fill
                quality={75}
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          <AboutCard
            title="Our Identity"
            description="A brotherhood of ADV riders connected by loyalty, respect, and shared passion for two wheels."
          />
          <AboutCard
            title="Our Culture"
            description="We promote clean builds, safe rides, proper discipline, and unity across every chapter."
          />
          <AboutCard
            title="Our Mission"
            description="To grow a strong ADV community that supports members, partners, events, and motorcycle lifestyle."
          />
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/3">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-red-500">
              Who We Are
            </p>
            <h2 className="mt-4 text-4xl font-black uppercase tracking-tight text-white">
              More than a motorcycle group
            </h2>
          </div>

          <div className="space-y-5 text-sm leading-8 text-white/65 md:text-base">
            <p>
              Boys of ADV is built around riders who take pride in their
              machines and their conduct. From daily rides to long-distance
              touring, from stock units to full custom builds, every member
              represents the same standard: respect, discipline, and passion.
            </p>

            <p>
              The community exists to highlight members, showcase builds,
              connect with trusted partners, and organize meaningful events that
              strengthen the ADV riding culture.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-4xl border border-red-600/30 bg-red-600/10 p-8 md:p-10">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-red-400">
            The Culture Behind The Build
          </p>

          <h2 className="mt-4 max-w-3xl text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
            Custom builds, performance, and brotherhood
          </h2>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/65 md:text-base">
            Boys of ADV is a community of riders who share a passion for
            customization, quality parts, unique builds, and the lifestyle that
            comes with owning a machine built to stand out.
          </p>
        </div>
      </section>
    </main>
  );
}

function AboutCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 p-6">
      <div className="mb-5 h-1.5 w-12 rounded-full bg-red-600" />
      <h3 className="text-xl font-black uppercase text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-white/60">{description}</p>
    </div>
  );
}
