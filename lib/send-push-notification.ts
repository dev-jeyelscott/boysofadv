import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { webPush, type PushPayload } from "@/lib/push";
import { pushSubscriptions } from "@/db/schema/push-subscriptions";
import { users } from "@/db/schema/users";

type PushSendResult = {
  total: number;
  success: number;
  failed: number;
};

type PushSubscriptionRecord = {
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
};

function getPushErrorStatusCode(error: unknown) {
  if (error && typeof error === "object" && "statusCode" in error) {
    const statusCode = error.statusCode;

    if (typeof statusCode === "number") {
      return statusCode;
    }
  }

  return null;
}

function isExpiredPushSubscription(error: unknown) {
  const statusCode = getPushErrorStatusCode(error);

  return statusCode === 404 || statusCode === 410;
}

async function removePushSubscription(endpoint: string) {
  await db
    .delete(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, endpoint));
}

async function sendPushToSubscription(
  subscription: PushSubscriptionRecord,
  payload: PushPayload,
  context: string,
) {
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
    const statusCode = getPushErrorStatusCode(error);

    console.error(
      `[PUSH] Failed ${context} for user ${subscription.userId}. Status: ${statusCode ?? "unknown"}. Endpoint: ${subscription.endpoint}`,
      error,
    );

    if (isExpiredPushSubscription(error)) {
      await removePushSubscription(subscription.endpoint);
    }

    return false;
  }
}

function summarizePushResults(results: boolean[]): PushSendResult {
  const success = results.filter(Boolean).length;

  return {
    total: results.length,
    success,
    failed: results.length - success,
  };
}

export async function sendPushNotificationToUser(
  userId: string,
  payload: PushPayload,
) {
  const subscriptions = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId));

  const results = await Promise.all(
    subscriptions.map((subscription) =>
      sendPushToSubscription(subscription, payload, "direct notification"),
    ),
  );

  const summary = summarizePushResults(results);

  console.log(
    `[PUSH] Direct notification completed for user ${userId}. Total: ${summary.total}, Success: ${summary.success}, Failed: ${summary.failed}`,
  );

  return summary;
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

  const results = await Promise.all(
    subscriptions.map((subscription) =>
      sendPushToSubscription(subscription, payload, "approved-user broadcast"),
    ),
  );

  const summary = summarizePushResults(results);

  console.log(
    `[PUSH] Broadcast completed. Total: ${summary.total}, Success: ${summary.success}, Failed: ${summary.failed}`,
  );

  return summary;
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

  const results = await Promise.all(
    subscriptions.map((subscription) =>
      sendPushToSubscription(subscription, payload, "admin broadcast"),
    ),
  );

  const summary = summarizePushResults(results);

  console.log(
    `[PUSH] Admin broadcast completed. Total: ${summary.total}, Success: ${summary.success}, Failed: ${summary.failed}`,
  );

  return summary;
}
