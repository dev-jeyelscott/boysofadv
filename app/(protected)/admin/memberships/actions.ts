"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import { USER_STATUSES } from "@/lib/constants/user";

export async function approveMember(userId: string) {
  await requireAdmin();

  await db
    .update(users)
    .set({
      status: USER_STATUSES.APPROVED,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  revalidatePath("/admin/members");
}

export async function rejectMember(userId: string) {
  await requireAdmin();

  await db
    .update(users)
    .set({
      status: USER_STATUSES.REJECTED,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  revalidatePath("/admin/members");
}