import { and, asc, eq, ilike } from "drizzle-orm";

import { db } from "@/db/db";
import { partners } from "@/db/schema";

const PARTNER_STATUSES = ["draft", "active", "inactive"] as const;

type PartnerStatus = (typeof PARTNER_STATUSES)[number];

type GetPartnersFilters = {
  search?: string;
  status?: string;
  category?: string;
  limit?: number;
};

function isPartnerStatus(status: string): status is PartnerStatus {
  return PARTNER_STATUSES.includes(status as PartnerStatus);
}

export async function getPartners(filters: GetPartnersFilters = {}) {
  const conditions = [];
  const limit = Math.min(Math.max(1, filters.limit ?? 50), 100);

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

  const data = await db
    .select({
      id: partners.id,
      name: partners.name,
      category: partners.category,
      description: partners.description,
      logoUrl: partners.logoUrl,
      logoKey: partners.logoKey,
      isOfficial: partners.isOfficial,
      status: partners.status,
      websiteUrl: partners.websiteUrl,
      facebookUrl: partners.facebookUrl,
      createdAt: partners.createdAt,
      updatedAt: partners.updatedAt,
    })
    .from(partners)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(asc(partners.name))
    .limit(limit);

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
