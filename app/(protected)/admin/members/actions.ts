"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { users } from "@/db/schema";

export async function suspendMember(memberId: string) {
  await db
    .update(users)
    .set({ status: "suspended", updatedAt: new Date() })
    .where(eq(users.id, memberId));

  revalidatePath("/admin/members");
}

export async function markMemberAsActive(memberId: string) {
  await db
    .update(users)
    .set({ status: "approved", updatedAt: new Date() })
    .where(eq(users.id, memberId));

  revalidatePath("/admin/members");
}

export async function promoteMemberToAdmin(memberId: string) {
  await db
    .update(users)
    .set({ role: "admin", updatedAt: new Date() })
    .where(eq(users.id, memberId));

  revalidatePath("/admin/members");
}

export async function demoteMemberToMember(memberId: string) {
  await db
    .update(users)
    .set({ role: "member", updatedAt: new Date() })
    .where(eq(users.id, memberId));

  revalidatePath("/admin/members");
}

export async function archiveMember(memberId: string) {
  await db
    .update(users)
    .set({ status: "archived", updatedAt: new Date() })
    .where(eq(users.id, memberId));

  revalidatePath("/admin/members");
}
