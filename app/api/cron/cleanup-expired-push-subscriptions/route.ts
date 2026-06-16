import { NextResponse } from "next/server";

import { monitorCronRun } from "@/lib/cron/cron-monitor";
import { cleanupExpiredPushSubscriptions } from "@/lib/cleanup-expired-subscriptions";
import { captureError } from "@/lib/observability/error-monitor";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await monitorCronRun({
      cronName: "cleanup-expired-push-subscriptions",
      handler: async () => {
        const cleanupResult = await cleanupExpiredPushSubscriptions(90);
        const deletedCount =
          "deleted" in cleanupResult &&
          typeof cleanupResult.deleted === "number"
            ? cleanupResult.deleted
            : 0;

        return {
          processedCount: deletedCount,
          metadata: cleanupResult,
          cleanupResult,
        };
      },
    });

    return NextResponse.json({
      success: true,
      ...result.cleanupResult,
    });
  } catch (error) {
    captureError(error, {
      source: "cron",
      cronName: "cleanup-expired-push-subscriptions",
    });

    return NextResponse.json(
      { error: "Failed to cleanup expired push subscriptions" },
      { status: 500 },
    );
  }
}
