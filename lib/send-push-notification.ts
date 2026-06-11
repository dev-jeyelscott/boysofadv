import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { webPush, type PushPayload } from "@/lib/push";
import { pushSubscriptions } from "@/db/schema/push-subscriptions";
import { users } from "@/db/schema/users";

export async function sendPushNotificationToUser(
  userId: string,
  payload: PushPayload,
) {
  const subscriptions = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId));

  await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      try {
        await webPush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          JSON.stringify(payload),
        );
      } catch (error) {
        console.error("Push notification failed:", error);

        // Remove expired subscriptions
        if (
          error &&
          typeof error === "object" &&
          "statusCode" in error &&
          error.statusCode === 410
        ) {
          await db
            .delete(pushSubscriptions)
            .where(eq(pushSubscriptions.endpoint, subscription.endpoint));
        }
      }
    }),
  );
}

export async function sendPushNotificationToAllApprovedUsers(
  payload: PushPayload,
) {
  const subscriptions = await db
    .select({
      userId: pushSubscriptions.userId,
      endpoint: pushSubscriptions.endpoint,
      p256dh: pushSubscriptions.p256dh,
      auth: pushSubscriptions.auth,
    })
    .from(pushSubscriptions)
    .innerJoin(users, eq(pushSubscriptions.userId, users.id))
    .where(eq(users.status, "approved"));

  const results = await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      try {
        await webPush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          JSON.stringify(payload),
        );

        return true;
      } catch (error) {
        console.error(`[PUSH] Failed for user ${subscription.userId}`, error);
        // Remove expired subscriptions
        if (
          error &&
          typeof error === "object" &&
          "statusCode" in error &&
          error.statusCode === 410
        ) {
          await db
            .delete(pushSubscriptions)
            .where(eq(pushSubscriptions.endpoint, subscription.endpoint));
        }
        return false;
      }
    }),
  );

  const success = results.filter(
    (result) => result.status === "fulfilled" && result.value === true,
  ).length;

  const failed = results.length - success;

  console.log(
    `[PUSH] Broadcast completed. Success: ${success}, Failed: ${failed}`,
  );

  return {
    total: results.length,
    success,
    failed,
  };
}

export async function sendPushNotificationToAllAdmins(payload: PushPayload) {
  const subscriptions = await db
    .select({
      userId: pushSubscriptions.userId,
      endpoint: pushSubscriptions.endpoint,
      p256dh: pushSubscriptions.p256dh,
      auth: pushSubscriptions.auth,
    })
    .from(pushSubscriptions)
    .innerJoin(users, eq(pushSubscriptions.userId, users.id))
    .where(eq(users.role, "admin"));

  const results = await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      try {
        await webPush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          JSON.stringify(payload),
        );

        return true;
      } catch (error) {
        console.error(`[PUSH] Failed for admin ${subscription.userId}`, error);
        // Remove expired subscriptions
        if (
          error &&
          typeof error === "object" &&
          "statusCode" in error &&
          error.statusCode === 410
        ) {
          await db
            .delete(pushSubscriptions)
            .where(eq(pushSubscriptions.endpoint, subscription.endpoint));
        }
        return false;
      }
    }),
  );

  const success = results.filter(
    (result) => result.status === "fulfilled" && result.value === true,
  ).length;

  const failed = results.length - success;

  console.log(
    `[PUSH] Admin broadcast completed. Success: ${success}, Failed: ${failed}`,
  );

  return {
    total: results.length,
    success,
    failed,
  };
}
