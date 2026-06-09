import { desc, eq } from "drizzle-orm";

import { db } from "@/db/db";
import { partners } from "@/db/schema";
import Link from "next/link";
import Image from "next/image";

export async function PartnersSection() {
  const activePartners = await db.query.partners.findMany({
    where: eq(partners.status, "active"),
    orderBy: [desc(partners.createdAt)],
  });

  if (activePartners.length === 0) {
    return null;
  }

  return (
    <section id="partners" className="relative overflow-hidden bg-black py-10">
      <div className="mx-auto my-10 max-w-7xl px-4">
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-red-600/40" />

          <h2 className="text-center text-3xl font-black uppercase tracking-wider italic text-white">
            Official <span className="text-red-500">Partners</span>
          </h2>

          <div className="h-px flex-1 bg-red-600/40" />
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-3">
          {activePartners.map((partner) => (
            <div
              key={partner.id}
              className="group flex h-40 items-center justify-center overflow-hidden rounded-sm border border-white/10 bg-neutral-950/80 px-5 transition hover:border-red-600/70 hover:bg-red-950/20"
            >
              <Link href={partner.websiteUrl ?? partner.facebookUrl ?? "#"}>
                {partner.logoUrl ? (
                  <Image
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="max-h-30 max-w-full object-contain transition-all duration-300 ease-out group-hover:scale-110"
                  />
                ) : (
                  <span className="text-sm font-bold uppercase tracking-wider text-white/50">
                    {partner.name}
                  </span>
                )}
              </Link>
            </div>
          ))}
        </div>

        {/* <div className="mt-5 flex justify-center">
          <button className="hidden items-center gap-2 rounded-sm border border-red-700/70 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-red-700 sm:flex">
            View All Partners
            <span className="text-red-500">›</span>
          </button>
        </div>

        <div className="mt-5 flex justify-center sm:hidden">
          <button className="rounded-sm border border-red-700/70 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-red-700">
            View All Partners <span className="text-red-500">›</span>
          </button>
        </div> */}
      </div>
    </section>
  );
}
