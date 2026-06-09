import { and, asc, desc, eq, ilike, ne, or, lt, sql } from "drizzle-orm";

import { db } from "@/db/db";
import { users } from "@/db/schema";

export type GetMembersParams = {
  search?: string;
  status?: string;
  chapter?: string;
  unit?: string;
  cursor?: string | null;
  limit?: number;
};

export async function getMembers({
  search,
  status,
  chapter,
  unit,
  cursor,
  limit = 20,
}: GetMembersParams) {
  const conditions = [
    ne(users.role, "super_admin"),
    or(eq(users.status, "approved"), eq(users.status, "suspended"))!,
  ];

  if (search) {
    conditions.push(
      or(
        ilike(users.firstName, `%${search}%`),
        ilike(users.lastName, `%${search}%`),
        ilike(users.email, `%${search}%`),
        ilike(users.nickname, `%${search}%`),
        ilike(users.codename, `%${search}%`),
      )!,
    );
  }

  if (status === "approved" || status === "suspended") {
    conditions.push(eq(users.status, status));
  }

  if (chapter && chapter !== "all") {
    conditions.push(eq(users.chapter, chapter));
  }

  if (unit && unit !== "all") {
    conditions.push(eq(users.unit, unit));
  }

  if (cursor) {
    conditions.push(lt(users.createdAt, new Date(cursor)));
  }

  const rows = await db.query.users.findMany({
    where: and(...conditions),
    orderBy: desc(users.createdAt),
    limit: limit + 1,
    columns: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      nickname: true,
      codename: true,
      chapter: true,
      unit: true,
      status: true,
      role: true,
      bio: true,
      createdAt: true,
    },
  });

  const members = rows
    .filter(
      (
        row,
      ): row is typeof row & {
        status: "approved" | "suspended";
      } => row.status === "approved" || row.status === "suspended",
    )
    .slice(0, limit)
    .map((member) => ({
      id: member.id,
      email: member.email,
      firstName: member.firstName,
      lastName: member.lastName,
      nickname: member.nickname,
      codename: member.codename,
      chapter: member.chapter,
      unit: member.unit,
      status: member.status,
      role: member.role,
      bio: member.bio,
      createdAt: member.createdAt,
    }));

  const hasMore = rows.length > limit;

  const nextCursor =
    hasMore && members.length > 0
      ? members[members.length - 1].createdAt.toISOString()
      : null;

  return {
    members,
    nextCursor,
    hasMore,
  };
}

export async function getMemberFilterOptions() {
  const chapters = await db
    .selectDistinct({
      chapter: users.chapter,
    })
    .from(users)
    .where(
      and(
        ne(users.status, "for_approval"),
        ne(users.role, "super_admin"),
        sql`${users.chapter} IS NOT NULL`,
        sql`${users.chapter} != ''`,
      ),
    )
    .orderBy(asc(users.chapter));

  const units = await db
    .selectDistinct({
      unit: users.unit,
    })
    .from(users)
    .where(
      and(
        ne(users.status, "for_approval"),
        ne(users.role, "super_admin"),
        sql`${users.unit} IS NOT NULL`,
        sql`${users.unit} != ''`,
      ),
    )
    .orderBy(asc(users.unit));

  return {
    chapters: chapters
      .map((item) => item.chapter)
      .filter((chapter): chapter is string => Boolean(chapter)),

    units: units
      .map((item) => item.unit)
      .filter((unit): unit is string => Boolean(unit)),
  };
}
