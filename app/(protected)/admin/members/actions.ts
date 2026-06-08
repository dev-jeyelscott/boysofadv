"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { users } from "@/db/schema";

export async function toggleMemberStatus(memberId: string) {
  const member = await db.query.users.findFirst({
    where: eq(users.id, memberId),
  });

  if (!member) {
    throw new Error("Member not found.");
  }

  if (member.status !== "approved" && member.status !== "suspended") {
    throw new Error("Invalid member status transition.");
  }

  const nextStatus = member.status === "approved" ? "suspended" : "approved";

  await db
    .update(users)
    .set({
      status: nextStatus,
      updatedAt: new Date(),
    })
    .where(eq(users.id, memberId));

  revalidatePath("/admin/members");
}
