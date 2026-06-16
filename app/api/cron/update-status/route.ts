import { and, eq, lt } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/db";
import { events } from "@/db/schema";
import { monitorCronRun } from "@/lib/cron/cron-monitor";
import { captureError } from "@/lib/observability/error-monitor";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await monitorCronRun({
      cronName: "update-status",
      handler: async () => {
        const now = new Date();

        const completedEvents = await db
          .update(events)
          .set({
            status: "completed",
            completedAt: now,
            statusUpdatedBy: "system",
            updatedAt: now,
          })
          .where(and(eq(events.status, "published"), lt(events.endsAt, now)))
          .returning({
            id: events.id,
            title: events.title,
          });

        return {
          processedCount: completedEvents.length,
          metadata: {
            completedEventIds: completedEvents.map((event) => event.id),
          },
          completedEvents,
        };
      },
    });

    return NextResponse.json({
      success: true,
      completedCount: result.completedEvents.length,
      completedEvents: result.completedEvents,
    });
  } catch (error) {
    captureError(error, { source: "cron", cronName: "update-status" });

    return NextResponse.json(
      { error: "Failed to update event statuses" },
      { status: 500 },
    );
  }
}
