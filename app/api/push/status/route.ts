import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

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

export async function POST(request: Request) {
  const user = await getCurrentDbUser();

  if (!user) {
    return NextResponse.json({ enabled: false }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    endpoint?: string;
  };

  if (!body.endpoint) {
    return NextResponse.json({ enabled: false }, { status: 400 });
  }

  const subscriptions = await db
    .select({ id: pushSubscriptions.id })
    .from(pushSubscriptions)
    .where(
      and(
        eq(pushSubscriptions.userId, user.id),
        eq(pushSubscriptions.endpoint, body.endpoint),
      ),
    )
    .limit(1);

  return NextResponse.json({
    enabled: subscriptions.length > 0,
  });
}
