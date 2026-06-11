"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { pushSubscriptions } from "@/db/schema/push-subscriptions";
import { getCurrentDbUser } from "@/lib/current-user";

type PushSubscriptionPayload = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export async function getPushNotificationStatusAction() {
  const user = await getCurrentDbUser();

  if (!user) {
    return false;
  }

  const subscriptions = await db
    .select({ id: pushSubscriptions.id })
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, user.id))
    .limit(1);

  return subscriptions.length > 0;
}

export async function savePushSubscriptionAction(
  subscription: PushSubscriptionPayload,
) {
  const user = await getCurrentDbUser();

  if (!user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  await db
    .insert(pushSubscriptions)
    .values({
      userId: user.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    })
    .onConflictDoUpdate({
      target: pushSubscriptions.endpoint,
      set: {
        userId: user.id,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    });

  return {
    success: true,
    message: "Alerts enabled.",
  };
}

export async function deletePushSubscriptionsAction() {
  const user = await getCurrentDbUser();

  if (!user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  await db
    .delete(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, user.id));

  return {
    success: true,
    message: "Alerts disabled.",
  };
}
