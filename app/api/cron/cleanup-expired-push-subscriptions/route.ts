import { cleanupExpiredPushSubscriptions } from "@/lib/cleanup-expired-subscriptions";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await cleanupExpiredPushSubscriptions(90);

  return NextResponse.json({
    success: true,
    ...result,
  });
}
