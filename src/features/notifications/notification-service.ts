import { eq, inArray, and } from "drizzle-orm";
import crypto from "crypto";

import { db } from "@/db/db";
import { pushSubscriptions, users } from "@/db/schema";
import { USER_ROLES, USER_STATUSES } from "@/lib/constants/user";
import { getWebPushClient } from "@/lib/push";
import type {
  NotificationDeliverySummary,
  NotificationPayload,
  PushSubscriptionInput,
} from "./notification-types";
import { ServiceError } from "@/src/lib/errors/service-error";

type PushSubscriptionRecord = {
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
};

const emptySummary: NotificationDeliverySummary = {
  attempted: 0,
  sent: 0,
  failed: 0,
  removedSubscriptions: 0,
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

function redactEndpoint(endpoint: string) {
  return crypto
    .createHash("sha256")
    .update(endpoint)
    .digest("hex")
    .slice(0, 12);
}

async function removePushSubscription(endpoint: string) {
  await db
    .delete(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, endpoint));
}

async function sendPushToSubscription(
  subscription: PushSubscriptionRecord,
  payload: NotificationPayload,
  context: string,
) {
  const webPush = getWebPushClient();

  if (!webPush.ok) {
    console.error("[PUSH_CONFIG_MISSING]", {
      context,
      userId: subscription.userId,
      endpointHash: redactEndpoint(subscription.endpoint),
      error: webPush.error,
    });

    return { sent: false, removed: false };
  }

  try {
    await webPush.client.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      },
      JSON.stringify(payload),
    );

    return { sent: true, removed: false };
  } catch (error) {
    const statusCode = getPushErrorStatusCode(error);
    const removed = isExpiredPushSubscription(error);

    console.error("[PUSH_SEND_FAILED]", {
      context,
      userId: subscription.userId,
      statusCode,
      endpointHash: redactEndpoint(subscription.endpoint),
      removed,
    });

    if (removed) {
      await removePushSubscription(subscription.endpoint);
    }

    return { sent: false, removed };
  }
}

function summarizePushResults(
  results: Array<{ sent: boolean; removed: boolean }>,
): NotificationDeliverySummary {
  const sent = results.filter((result) => result.sent).length;
  const removedSubscriptions = results.filter(
    (result) => result.removed,
  ).length;

  return {
    attempted: results.length,
    sent,
    failed: results.length - sent,
    removedSubscriptions,
  };
}

async function deliver(
  subscriptions: PushSubscriptionRecord[],
  payload: NotificationPayload,
  context: string,
) {
  if (subscriptions.length === 0) {
    return emptySummary;
  }

  const results = await Promise.all(
    subscriptions.map((subscription) =>
      sendPushToSubscription(subscription, payload, context),
    ),
  );

  const summary = summarizePushResults(results);

  console.log("[PUSH_DELIVERY_SUMMARY]", {
    context,
    ...summary,
  });

  return summary;
}

export const NotificationService = {
  async notifyUser(input: {
    userId: string;
    payload: NotificationPayload;
  }): Promise<NotificationDeliverySummary> {
    const subscriptions = await db
      .select({
        userId: pushSubscriptions.userId,
        endpoint: pushSubscriptions.endpoint,
        p256dh: pushSubscriptions.p256dh,
        auth: pushSubscriptions.auth,
      })
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.userId, input.userId));

    return deliver(subscriptions, input.payload, "user");
  },

  async notifyAdmins(input: {
    payload: NotificationPayload;
  }): Promise<NotificationDeliverySummary> {
    const subscriptions = await db
      .select({
        userId: pushSubscriptions.userId,
        endpoint: pushSubscriptions.endpoint,
        p256dh: pushSubscriptions.p256dh,
        auth: pushSubscriptions.auth,
      })
      .from(pushSubscriptions)
      .innerJoin(users, eq(pushSubscriptions.userId, users.id))
      .where(
        and(
          inArray(users.role, [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
          eq(users.status, USER_STATUSES.APPROVED),
        ),
      );

    return deliver(subscriptions, input.payload, "admins");
  },

  async notifyApprovedMembers(input: {
    payload: NotificationPayload;
  }): Promise<NotificationDeliverySummary> {
    const subscriptions = await db
      .select({
        userId: pushSubscriptions.userId,
        endpoint: pushSubscriptions.endpoint,
        p256dh: pushSubscriptions.p256dh,
        auth: pushSubscriptions.auth,
      })
      .from(pushSubscriptions)
      .innerJoin(users, eq(pushSubscriptions.userId, users.id))
      .where(eq(users.status, USER_STATUSES.APPROVED));

    return deliver(subscriptions, input.payload, "approved_members");
  },

  async notifyBuildPublished(input: {
    ownerId: string;
    slug: string;
  }): Promise<NotificationDeliverySummary> {
    return this.notifyUser({
      userId: input.ownerId,
      payload: {
        title: "Build Published",
        body: "Your build has been published.",
        url: `/builds/${input.slug}`,
      },
    });
  },

  async notifyBuildRejected(input: {
    ownerId: string;
  }): Promise<NotificationDeliverySummary> {
    return this.notifyUser({
      userId: input.ownerId,
      payload: {
        title: "Build Rejected",
        body: "Your build is not approved to publish. Please check the contents of your build and resubmit application.",
        url: "/member/my-build",
      },
    });
  },

  async notifyEventCreated(input: {
    eventId: string;
    title: string;
  }): Promise<NotificationDeliverySummary> {
    return this.notifyApprovedMembers({
      payload: {
        title: "New Event Published",
        body: input.title,
        url: `/events/${input.eventId}`,
      },
    });
  },

  async notifyEventUpdated(input: {
    eventId: string;
    title: string;
  }): Promise<NotificationDeliverySummary> {
    return this.notifyApprovedMembers({
      payload: {
        title: "Event Updated",
        body: input.title,
        url: `/events/${input.eventId}`,
      },
    });
  },

  async notifyEventCancelled(input: {
    eventId: string;
    title: string;
  }): Promise<NotificationDeliverySummary> {
    return this.notifyApprovedMembers({
      payload: {
        title: "Event Cancelled",
        body: input.title,
        url: `/events/${input.eventId}`,
      },
    });
  },

  async registerSubscription(input: {
    userId: string;
    subscription: PushSubscriptionInput;
  }) {
    if (
      !input.subscription.endpoint ||
      !input.subscription.keys?.p256dh ||
      !input.subscription.keys?.auth
    ) {
      throw new ServiceError("VALIDATION_ERROR", "Invalid push subscription.");
    }

    await db
      .insert(pushSubscriptions)
      .values({
        userId: input.userId,
        endpoint: input.subscription.endpoint,
        p256dh: input.subscription.keys.p256dh,
        auth: input.subscription.keys.auth,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: pushSubscriptions.endpoint,
        set: {
          userId: input.userId,
          p256dh: input.subscription.keys.p256dh,
          auth: input.subscription.keys.auth,
          updatedAt: new Date(),
        },
      });

    return { success: true };
  },

  async unregisterSubscription(input: { userId: string; endpoint: string }) {
    if (!input.endpoint) {
      throw new ServiceError("VALIDATION_ERROR", "Missing endpoint.");
    }

    await db
      .delete(pushSubscriptions)
      .where(
        and(
          eq(pushSubscriptions.endpoint, input.endpoint),
          eq(pushSubscriptions.userId, input.userId),
        ),
      );

    return { success: true };
  },

  async getSubscriptionStatus(input: { userId: string; endpoint?: string }) {
    const conditions = [eq(pushSubscriptions.userId, input.userId)];

    if (input.endpoint) {
      conditions.push(eq(pushSubscriptions.endpoint, input.endpoint));
    }

    const subscriptions = await db
      .select({ id: pushSubscriptions.id })
      .from(pushSubscriptions)
      .where(and(...conditions))
      .limit(1);

    return { enabled: subscriptions.length > 0 };
  },
};
