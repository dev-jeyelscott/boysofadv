import { desc, eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

import { db } from "@/db/db";
import { partners } from "@/db/schema";

export async function PartnersSection() {
  const activePartners = await db.query.partners.findMany({
    where: eq(partners.status, "active"),
    orderBy: [desc(partners.createdAt)],
  });

  if (activePartners.length === 0) {
    return null;
  }

  return (
    <section id="partners" className="relative overflow-hidden bg-black py-8">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-center justify-center gap-3 sm:mb-10 sm:gap-4">
          <div className="h-px flex-1 bg-red-600/40" />

          <h2 className="shrink-0 text-center text-2xl font-black uppercase italic tracking-wide text-white sm:text-3xl lg:text-4xl">
            Official <span className="text-red-500">Partners</span>
          </h2>

          <div className="h-px flex-1 bg-red-600/40" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:gap-8">
          {activePartners.map((partner) => {
            const href = partner.websiteUrl ?? partner.facebookUrl ?? "#";

            return (
              <Link
                key={partner.id}
                href={href}
                target={href === "#" ? undefined : "_blank"}
                rel={href === "#" ? undefined : "noopener noreferrer"}
                className="group flex min-h-28 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-neutral-950/80 p-4 transition hover:border-red-600/70 hover:bg-red-950/20 sm:min-h-36 sm:p-5 lg:min-h-40"
              >
                {partner.logoUrl ? (
                  <Image
                    width={400}
                    height={400}
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="max-h-20 w-full object-contain transition duration-300 ease-out group-hover:scale-105 sm:max-h-28 lg:max-h-32"
                  />
                ) : (
                  <span className="text-center text-xs font-black uppercase tracking-wider text-white/60 sm:text-sm">
                    {partner.name}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
