"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { users } from "@/db/schema";
import { sendPushNotificationToUser } from "@/lib/send-push-notification";

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

  await sendPushNotificationToUser(memberId, {
    title: "Account Active",
    body: `Your account is now active.`,
    url: "/member/profile",
  });

  revalidatePath("/admin/members");
}

export async function promoteMemberToAdmin(memberId: string) {
  await db
    .update(users)
    .set({ role: "admin", updatedAt: new Date() })
    .where(eq(users.id, memberId));

  await sendPushNotificationToUser(memberId, {
    title: "You've been Promoted",
    body: `Congratulations! You've been promoted as Boys of ADV Admin.`,
    url: "/admin/dashboard",
  });

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
