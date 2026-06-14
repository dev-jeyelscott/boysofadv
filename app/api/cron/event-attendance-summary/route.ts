import { NextResponse } from "next/server";
import { and, eq, isNull, lt, sql } from "drizzle-orm";

import { events } from "@/db/schema/events";
import { eventAttendance } from "@/db/schema/event-attendance";
import { db } from "@/db/db";
import { sendPushNotificationToAllAdmins } from "@/lib/send-push-notification";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const completedEvents = await db
    .select({
      id: events.id,
      title: events.title,
      startDate: events.startDate,
      endDate: events.endDate,
    })
    .from(events)
    .where(
      and(
        eq(events.status, "published"),
        lt(events.endDate, now),
        isNull(events.attendanceSummarySentAt),
      ),
    );

  if (!completedEvents.length) {
    return NextResponse.json({
      ok: true,
      processed: 0,
      summaries: [],
    });
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

  return NextResponse.json({
    ok: true,
    processed: summaries.length,
    summaries,
  });
}
