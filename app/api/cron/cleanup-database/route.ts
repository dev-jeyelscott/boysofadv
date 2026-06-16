import { NextResponse } from "next/server";

import { monitorCronRun } from "@/lib/cron/cron-monitor";
import { captureError } from "@/lib/observability/error-monitor";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await monitorCronRun({
      cronName: "cleanup-database",
      handler: async () => ({
        processedCount: 0,
        metadata: {
          message: "No database cleanup tasks configured",
        },
        message: "No database cleanup tasks configured",
      }),
    });

    return NextResponse.json({
      success: true,
      processed: result.processedCount,
      message: result.message,
    });
  } catch (error) {
    captureError(error, { source: "cron", cronName: "cleanup-database" });

    return NextResponse.json(
      { error: "Failed to cleanup database" },
      { status: 500 },
    );
  }
}
