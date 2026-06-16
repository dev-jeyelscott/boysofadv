import { and, eq, isNull, lt, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/db";
import { eventAttendance } from "@/db/schema/event-attendance";
import { events } from "@/db/schema/events";
import { monitorCronRun } from "@/lib/cron/cron-monitor";
import { captureError } from "@/lib/observability/error-monitor";
import { sendPushNotificationToAllAdmins } from "@/lib/send-push-notification";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await monitorCronRun({
      cronName: "event-attendance-summary",
      handler: async () => {
        const now = new Date();

        const completedEvents = await db
          .select({
            id: events.id,
            title: events.title,
            startsAt: events.startsAt,
            endsAt: events.endsAt,
          })
          .from(events)
          .where(
            and(
              eq(events.status, "published"),
              lt(events.endsAt, now),
              isNull(events.attendanceSummarySentAt),
            ),
          );

        if (!completedEvents.length) {
          return {
            processedCount: 0,
            metadata: { summaries: [] },
            summaries: [],
          };
        }

        const summaries: Array<{
          eventId: string;
          title: string;
          checkedIn: number;
        }> = [];

        for (const event of completedEvents) {
          const [attendanceCount] = await db
            .select({
              total: sql<number>`count(*)::int`,
            })
            .from(eventAttendance)
            .where(eq(eventAttendance.eventId, event.id));

          const totalCheckedIn = attendanceCount?.total ?? 0;

          await sendPushNotificationToAllAdmins({
            title: "Event Attendance Summary",
            body: `${event.title}: ${totalCheckedIn} member${
              totalCheckedIn === 1 ? "" : "s"
            } checked in.`,
            url: `/admin/events/${event.id}`,
          });

          await db
            .update(events)
            .set({
              attendanceSummarySentAt: new Date(),
            })
            .where(eq(events.id, event.id));

          summaries.push({
            eventId: event.id,
            title: event.title,
            checkedIn: totalCheckedIn,
          });
        }

        return {
          processedCount: summaries.length,
          metadata: {
            summaryEventIds: summaries.map((summary) => summary.eventId),
          },
          summaries,
        };
      },
    });

    return NextResponse.json({
      ok: true,
      processed: result.summaries.length,
      summaries: result.summaries,
    });
  } catch (error) {
    captureError(error, {
      source: "cron",
      cronName: "event-attendance-summary",
    });

    return NextResponse.json(
      { ok: false, error: "Failed to send attendance summaries." },
      { status: 500 },
    );
  }
}
