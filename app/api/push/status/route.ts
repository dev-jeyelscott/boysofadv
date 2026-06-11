import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { getCurrentDbUser } from "@/lib/current-user";
import { pushSubscriptions } from "@/db/schema/push-subscriptions";

export async function GET() {
  const user = await getCurrentDbUser();

  if (!user) {
    return NextResponse.json({ enabled: false }, { status: 401 });
  }

  const subscriptions = await db
    .select({ id: pushSubscriptions.id })
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, user.id))
    .limit(1);

  return NextResponse.json({
    enabled: subscriptions.length > 0,
  });
}
