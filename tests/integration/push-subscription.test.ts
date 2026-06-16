import { afterEach, describe, expect, it } from "vitest";

import { db } from "@/db/db";
import { pushSubscriptions, users } from "@/db/schema";
import { NotificationService } from "@/src/features/notifications/notification-service";
import { createPushSubscription } from "@/tests/factories/push-subscriptions";
import { createApprovedMember } from "@/tests/factories/users";
import { cleanupTestDatabase, hasTestDatabase } from "./test-db";

const run = hasTestDatabase ? describe : describe.skip;

run("push subscription integration", () => {
  afterEach(cleanupTestDatabase);

  it("saves, updates, and removes a member push subscription", async () => {
    const member = createApprovedMember();
    const subscription = createPushSubscription();
    await db.insert(users).values(member);

    await NotificationService.registerSubscription({
      userId: member.id,
      subscription,
    });
    await NotificationService.registerSubscription({
      userId: member.id,
      subscription: createPushSubscription({
        endpoint: subscription.endpoint,
        keys: { p256dh: "updated", auth: "updated-auth" },
      }),
    });

    const rows = await db.select().from(pushSubscriptions);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.p256dh).toBe("updated");

    await NotificationService.unregisterSubscription({
      userId: member.id,
      endpoint: subscription.endpoint,
    });

    expect(await db.select().from(pushSubscriptions)).toHaveLength(0);
  });

  it("rejects invalid payloads", async () => {
    await expect(
      NotificationService.registerSubscription({
        userId: "member-1",
        subscription: { endpoint: "", keys: { p256dh: "", auth: "" } },
      }),
    ).rejects.toThrow("Invalid push subscription.");
  });
});
