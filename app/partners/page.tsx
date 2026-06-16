import Image from "next/image";

import { SiteHeader } from "@/components/site/site-header";
import Link from "next/link";
import { getActivePublicPartners } from "@/src/features/partners/queries";

export default async function PartnersPage() {
  const partnerRows = await getActivePublicPartners(24);

  return (
    <main className="min-h-screen bg-black text-white">
      <SiteHeader />

      <section className="relative overflow-hidden px-4 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.18),transparent_35%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-red-600/40" />
            <h1 className="text-center text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
              Our Partners
            </h1>
            <div className="h-px flex-1 bg-red-600/40" />
          </div>

          <p className="mx-auto mb-12 max-w-2xl text-center text-sm leading-7 text-white/60 md:text-base">
            Brands, shops, and supporters connected with the Boys of ADV
            community.
          </p>

          {partnerRows.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/4 p-10 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-white/50">
                No active partners yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {partnerRows.map((partner) => (
                <article
                  key={partner.id}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/4 p-5 transition hover:border-red-600/50 hover:bg-white/[0.07]"
                >
                  <Link href={partner.websiteUrl ?? partner.facebookUrl ?? ""}>
                    <div className="flex aspect-video items-center justify-center rounded-2xl border border-white/10 bg-black p-6">
                      {partner.logoUrl ? (
                        <Image
                          src={partner.logoUrl}
                          alt={`${partner.name} logo`}
                          width={180}
                          height={120}
                          loading="lazy"
                          quality={60}
                          sizes="(max-width: 768px) 70vw, (max-width: 1024px) 45vw, 240px"
                          className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-xl bg-white/3">
                          <span className="text-center text-xs font-black uppercase tracking-widest text-white/30">
                            No Logo
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex justify-center">
                      <h2 className="font-black uppercase text-white">
                        {partner.name}
                      </h2>

                      {partner.description ? (
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/55">
                          {partner.description}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
