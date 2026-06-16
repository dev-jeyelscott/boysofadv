import { unstable_cache } from "next/cache";
import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/db/db";
import { partners } from "@/db/schema";
import { CACHE_TAGS } from "@/src/lib/cache/keys";
import { PUBLIC_CACHE_REVALIDATE_SECONDS } from "@/src/lib/cache/public-cache";

export async function getActivePublicPartners(limit = 12) {
  const safeLimit = Math.min(Math.max(1, limit), 24);

  return unstable_cache(
    () =>
      db
        .select({
          id: partners.id,
          name: partners.name,
          description: partners.description,
          logoUrl: partners.logoUrl,
          websiteUrl: partners.websiteUrl,
          facebookUrl: partners.facebookUrl,
          displayOrder: partners.displayOrder,
          createdAt: partners.createdAt,
        })
        .from(partners)
        .where(eq(partners.status, "active"))
        .orderBy(asc(partners.displayOrder), desc(partners.createdAt))
        .limit(safeLimit),
    [`${CACHE_TAGS.publicPartnersActive}:limit:${safeLimit}`],
    {
      tags: [CACHE_TAGS.publicPartnersActive],
      revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS.activePartners,
    },
  )();
}
