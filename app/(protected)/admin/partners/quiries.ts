import { and, asc, eq, ilike } from "drizzle-orm";

import { db } from "@/db/db";
import { partners } from "@/db/schema";

const PARTNER_STATUSES = ["draft", "active", "inactive"] as const;

type PartnerStatus = (typeof PARTNER_STATUSES)[number];

type GetPartnersFilters = {
  search?: string;
  status?: string;
  category?: string;
};

function isPartnerStatus(status: string): status is PartnerStatus {
  return PARTNER_STATUSES.includes(status as PartnerStatus);
}

export async function getPartners(filters: GetPartnersFilters = {}) {
  const conditions = [];

  if (filters.search) {
    conditions.push(ilike(partners.name, `%${filters.search}%`));
  }

  if (
    filters.status &&
    filters.status !== "all" &&
    isPartnerStatus(filters.status)
  ) {
    conditions.push(eq(partners.status, filters.status));
  }

  if (filters.category && filters.category !== "all") {
    conditions.push(eq(partners.category, filters.category));
  }

  const data = await db.query.partners.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    orderBy: asc(partners.name),
  });

  return {
    partners: data,
  };
}

export async function getPartnerFilterOptions() {
  const data = await db
    .select({
      category: partners.category,
    })
    .from(partners)
    .orderBy(asc(partners.category));

  const categories = Array.from(
    new Set(
      data
        .map((item) => item.category)
        .filter((category): category is string => Boolean(category)),
    ),
  );

  return {
    categories,
  };
}
