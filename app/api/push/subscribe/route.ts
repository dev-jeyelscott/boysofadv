import { NextResponse } from "next/server";

import { db } from "@/db/db";
import { getCurrentDbUser } from "@/lib/current-user";
import { pushSubscriptions } from "@/db/schema/push-subscriptions";
import { eq } from "drizzle-orm";

type PushSubscriptionBody = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export async function POST(request: Request) {
  const user = await getCurrentDbUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const subscription = (await request.json()) as PushSubscriptionBody;

  if (
    !subscription.endpoint ||
    !subscription.keys?.p256dh ||
    !subscription.keys?.auth
  ) {
    return NextResponse.json(
      { message: "Invalid push subscription." },
      { status: 400 },
    );
  }

  await db
    .insert(pushSubscriptions)
    .values({
      userId: user.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: pushSubscriptions.endpoint,
      set: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        updatedAt: new Date(),
      },
      where: eq(pushSubscriptions.userId, user.id),
    });

  return NextResponse.json({ message: "Subscribed." });
}
