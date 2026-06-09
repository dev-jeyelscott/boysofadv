// app/(protected)/admin/membership-approvals/queries.ts
import { and, desc, eq, ilike, ne, or, sql } from "drizzle-orm";

import { db } from "@/db/db";
import { users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import { USER_ROLES, USER_STATUSES } from "@/lib/constants/user";

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

  const trimmedSearch = search?.trim();

  const members = await db.query.users.findMany({
    where: and(
      ne(users.role, USER_ROLES.SUPER_ADMIN),
      eq(users.status, USER_STATUSES.FOR_APPROVAL),

      trimmedSearch
        ? or(
            ilike(users.firstName, `%${trimmedSearch}%`),
            ilike(users.lastName, `%${trimmedSearch}%`),
            ilike(users.email, `%${trimmedSearch}%`),
            ilike(users.nickname, `%${trimmedSearch}%`),
            ilike(users.codename, `%${trimmedSearch}%`),
          )
        : undefined,

      chapter && chapter !== "all" ? eq(users.chapter, chapter) : undefined,
      unit && unit !== "all" ? eq(users.unit, unit) : undefined,
    ),
    orderBy: desc(users.createdAt),
  });

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
