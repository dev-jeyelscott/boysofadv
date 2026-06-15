import { and, desc, eq, ne, sql } from "drizzle-orm";

import { db } from "@/db/db";
import { users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import { USER_ROLES, USER_STATUSES } from "@/lib/constants/user";
import {
  hasSearchQuery,
  normalizeSearchQuery,
  searchRank,
  searchVectorMatches,
} from "@/lib/db/search";

type GetMembershipApprovalsParams = {
  search?: string;
  chapter?: string;
  unit?: string;
};

export async function getMembershipApprovals({
  search,
  chapter,
  unit,
}: GetMembershipApprovalsParams = {}) {
  await requireAdmin();

  const query = hasSearchQuery(search)
    ? normalizeSearchQuery(search ?? "")
    : "";
  const rank = query
    ? searchRank(users.searchVector, "simple", query)
    : undefined;

  const members = await db
    .select()
    .from(users)
    .where(
      and(
        ne(users.role, USER_ROLES.SUPER_ADMIN),
        eq(users.status, USER_STATUSES.FOR_APPROVAL),

        query
          ? searchVectorMatches(users.searchVector, "simple", query)
          : undefined,

        chapter && chapter !== "all" ? eq(users.chapter, chapter) : undefined,
        unit && unit !== "all" ? eq(users.unit, unit) : undefined,
      ),
    )
    .orderBy(
      ...(rank ? [desc(rank), desc(users.createdAt)] : [desc(users.createdAt)]),
    );

  return { members };
}

export async function getMembershipApprovalFilterOptions() {
  await requireAdmin();

  const [chapters, units] = await Promise.all([
    db
      .selectDistinct({ value: users.chapter })
      .from(users)
      .where(
        and(
          eq(users.status, USER_STATUSES.FOR_APPROVAL),
          sql`${users.chapter} is not null`,
        ),
      ),

    db
      .selectDistinct({ value: users.unit })
      .from(users)
      .where(
        and(
          eq(users.status, USER_STATUSES.FOR_APPROVAL),
          sql`${users.unit} is not null`,
        ),
      ),
  ]);

  return {
    chapters: chapters
      .map((item) => item.value)
      .filter((value): value is string => Boolean(value)),

    units: units
      .map((item) => item.value)
      .filter((value): value is string => Boolean(value)),
  };
}
