import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/db/db";
import { getCurrentDbUser } from "@/lib/current-user";
import { pushSubscriptions } from "@/db/schema/push-subscriptions";

export async function POST(request: Request) {
  const user = await getCurrentDbUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { endpoint?: string };

  if (!body.endpoint) {
    return NextResponse.json({ message: "Missing endpoint." }, { status: 400 });
  }

  await db
    .delete(pushSubscriptions)
    .where(
      and(
        eq(pushSubscriptions.endpoint, body.endpoint),
        eq(pushSubscriptions.userId, user.id),
      ),
    );

  return NextResponse.json({ message: "Push notification disablded." });
}
