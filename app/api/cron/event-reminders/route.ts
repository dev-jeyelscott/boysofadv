import { and, eq, gte, lte } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/db";
import { events, eventReminders } from "@/db/schema";
import { monitorCronRun } from "@/lib/cron/cron-monitor";
import { captureError } from "@/lib/observability/error-monitor";
import { sendPushNotificationToAllApprovedUsers } from "@/lib/send-push-notification";

export const runtime = "nodejs";

const REMINDER_WINDOW_MINUTES = 60;

const reminders = [
  {
    type: "7_days",
    hoursBeforeEvent: 24 * 7,
    message: "is happening next week.",
  },
  {
    type: "1_day",
    hoursBeforeEvent: 24,
    message: "is happening tomorrow.",
  },
  {
    type: "2_hours",
    hoursBeforeEvent: 2,
    message: "starts in about 2 hours.",
  },
] as const;

function isAuthorized(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return false;
  }

  return authHeader === `Bearer ${cronSecret}`;
}

function getReminderWindow(hoursBeforeEvent: number) {
  const now = new Date();

  const targetTime = new Date(
    now.getTime() + hoursBeforeEvent * 60 * 60 * 1000,
  );

  const windowStart = new Date(
    targetTime.getTime() - REMINDER_WINDOW_MINUTES * 60 * 1000,
  );

  const windowEnd = new Date(
    targetTime.getTime() + REMINDER_WINDOW_MINUTES * 60 * 1000,
  );

  return {
    windowStart,
    windowEnd,
  };
}

export async function GET(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const result = await monitorCronRun({
      cronName: "event-reminders",
      handler: async () => {
        let sentCount = 0;
        let skippedCount = 0;

        for (const reminder of reminders) {
          const { windowStart, windowEnd } = getReminderWindow(
            reminder.hoursBeforeEvent,
          );

          const dueEvents = await db
            .select({
              id: events.id,
              title: events.title,
              slug: events.slug,
              startsAt: events.startsAt,
            })
            .from(events)
            .where(
              and(
                eq(events.status, "published"),
                gte(events.startsAt, windowStart),
                lte(events.startsAt, windowEnd),
              ),
            );

          for (const event of dueEvents) {
            const existingReminder = await db
              .select({
                id: eventReminders.id,
              })
              .from(eventReminders)
              .where(
                and(
                  eq(eventReminders.eventId, event.id),
                  eq(eventReminders.reminderType, reminder.type),
                ),
              )
              .limit(1);

            if (existingReminder.length > 0) {
              skippedCount++;
              continue;
            }

            await sendPushNotificationToAllApprovedUsers({
              title: "Upcoming Event Reminder",
              body: `${event.title} ${reminder.message}`,
              url: `/events/${event.slug}`,
            });

            await db.insert(eventReminders).values({
              eventId: event.id,
              reminderType: reminder.type,
            });

            sentCount++;
          }
        }

        return {
          processedCount: sentCount + skippedCount,
          metadata: {
            sentCount,
            skippedCount,
          },
          sentCount,
          skippedCount,
        };
      },
    });

    return NextResponse.json({
      success: true,
      sentCount: result.sentCount,
      skippedCount: result.skippedCount,
    });
  } catch (error) {
    captureError(error, { source: "cron", cronName: "event-reminders" });

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process event reminders",
      },
      {
        status: 500,
      },
    );
  }
}
