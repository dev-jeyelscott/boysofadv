import { unstable_cache } from "next/cache";
import type { SQL } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { and, desc, eq, gte, ne, sql } from "drizzle-orm";

import { db } from "@/db/db";
import { builds, events, partners, users } from "@/db/schema";
import { BUILD_STATUSES } from "@/lib/constants/build";
import { EVENT_STATUSES } from "@/lib/constants/event";
import { USER_STATUSES } from "@/lib/constants/user";
import { CACHE_TAGS } from "@/src/lib/cache/keys";
import { PUBLIC_CACHE_REVALIDATE_SECONDS } from "@/src/lib/cache/public-cache";

async function getCount(table: PgTable, where?: SQL) {
  const query = db
    .select({
      value: sql<number>`count(*)::int`,
    })
    .from(table)
    .$dynamic();

  const [result] = where ? await query.where(where) : await query;

  return result?.value ?? 0;
}

export async function getHomepageStats() {
  return unstable_cache(
    async () => {
      const now = new Date();
      const [approvedMembers, publishedBuilds, activePartners, upcomingEvents] =
        await Promise.all([
          getCount(users, eq(users.status, USER_STATUSES.APPROVED)),
          getCount(builds, eq(builds.status, BUILD_STATUSES.PUBLISHED)),
          getCount(partners, eq(partners.status, "active")),
          getCount(
            events,
            and(
              eq(events.status, EVENT_STATUSES.PUBLISHED),
              gte(events.startsAt, now),
            ),
          ),
        ]);

      return {
        approvedMembers,
        publishedBuilds,
        activePartners,
        upcomingEvents,
      };
    },
    [CACHE_TAGS.homepageStats],
    {
      tags: [CACHE_TAGS.homepageStats],
      revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS.homepageStats,
    },
  )();
}

export async function getAdminDashboardData() {
  return unstable_cache(
    async () => {
      const today = new Date();

      const [
        totalMembers,
        pendingMembers,
        approvedMembers,
        suspendedMembers,
        totalBuilds,
        pendingBuilds,
        publishedBuilds,
        featuredBuildsCount,
        totalPartners,
        featuredPartners,
        upcomingEvents,
        recentMembers,
        recentBuilds,
        recentPartners,
        recentEvents,
      ] = await Promise.all([
        getCount(users),
        getCount(users, eq(users.status, USER_STATUSES.FOR_APPROVAL)),
        getCount(users, eq(users.status, USER_STATUSES.APPROVED)),
        getCount(users, eq(users.status, USER_STATUSES.SUSPENDED)),
        getCount(builds),
        getCount(builds, eq(builds.status, BUILD_STATUSES.FOR_REVIEW)),
        getCount(builds, ne(builds.status, BUILD_STATUSES.DRAFT)),
        getCount(builds, eq(builds.isFeatured, true)),
        getCount(partners),
        getCount(partners, eq(partners.isOfficial, true)),
        getCount(
          events,
          and(
            eq(events.status, EVENT_STATUSES.PUBLISHED),
            gte(events.startsAt, today),
          ),
        ),
        db
          .select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            nickname: users.nickname,
            codename: users.codename,
            email: users.email,
            unit: users.unit,
            status: users.status,
            createdAt: users.createdAt,
          })
          .from(users)
          .orderBy(desc(users.createdAt))
          .limit(5),
        db
          .select({
            id: builds.id,
            title: builds.title,
            motorcycleModel: builds.motorcycleModel,
            status: builds.status,
            isFeatured: builds.isFeatured,
            createdAt: builds.createdAt,
            ownerFirstName: users.firstName,
            ownerLastName: users.lastName,
            ownerNickname: users.nickname,
            ownerEmail: users.email,
          })
          .from(builds)
          .leftJoin(users, eq(builds.userId, users.id))
          .orderBy(desc(builds.createdAt))
          .limit(5),
        db
          .select({
            id: partners.id,
            name: partners.name,
            isOfficial: partners.isOfficial,
            createdAt: partners.createdAt,
          })
          .from(partners)
          .orderBy(desc(partners.createdAt))
          .limit(5),
        db
          .select({
            id: events.id,
            title: events.title,
            location: events.location,
            startsAt: events.startsAt,
            createdAt: events.createdAt,
          })
          .from(events)
          .where(
            and(
              eq(events.status, EVENT_STATUSES.PUBLISHED),
              gte(events.startsAt, today),
            ),
          )
          .orderBy(events.startsAt)
          .limit(5),
      ]);

      return {
        totalMembers,
        pendingMembers,
        approvedMembers,
        suspendedMembers,
        totalBuilds,
        pendingBuilds,
        publishedBuilds,
        featuredBuildsCount,
        totalPartners,
        featuredPartners,
        upcomingEvents,
        recentMembers,
        recentBuilds,
        recentPartners,
        recentEvents,
      };
    },
    [CACHE_TAGS.adminDashboard],
    {
      tags: [CACHE_TAGS.adminDashboard],
      revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS.homepageStats,
    },
  )();
}
