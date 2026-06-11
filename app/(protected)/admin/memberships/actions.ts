"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import { USER_STATUSES } from "@/lib/constants/user";
import { sendPushNotificationToUser } from "@/lib/send-push-notification";

export async function approveMember(userId: string) {
  await requireAdmin();

  await db
    .update(users)
    .set({
      status: USER_STATUSES.APPROVED,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  await sendPushNotificationToUser(userId, {
    title: "Membership Approved",
    body: `Your membership application is approved.`,
    url: "/my-profile",
  });

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

  await sendPushNotificationToUser(userId, {
    title: "Membership Declined",
    body: `Your membership application is rejected. Please coordinate with your designated admin.`,
    url: "/my-profile",
  });

  revalidatePath("/admin/members");
}
