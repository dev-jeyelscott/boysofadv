import { NextResponse } from "next/server";
import { events } from "@/db/schema";
import { and, eq, lt } from "drizzle-orm";
import { db } from "@/db/db";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const completedEvents = await db
    .update(events)
    .set({
      status: "completed",
      completedAt: now,
      statusUpdatedBy: "system",
      updatedAt: now,
    })
    .where(and(eq(events.status, "published"), lt(events.endDate, now)))
    .returning({
      id: events.id,
      title: events.title,
    });

  return NextResponse.json({
    success: true,
    completedCount: completedEvents.length,
    completedEvents,
  });
}
