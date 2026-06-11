import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { events } from "@/db/schema";
import { getCurrentDbUser } from "@/lib/current-user";
import { createAttendanceToken } from "@/lib/attendance-token";

type Props = {
  params: Promise<{
    eventId: string;
  }>;
};

export async function GET(_request: Request, { params }: Props) {
  const { eventId } = await params;

  const user = await getCurrentDbUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (user.role === "member") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const [event] = await db
    .select({
      id: events.id,
      title: events.title,
    })
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (!event) {
    return NextResponse.json({ message: "Event not found" }, { status: 404 });
  }

  const token = createAttendanceToken(event.id);

  const checkInUrl = `${process.env.NEXT_PUBLIC_APP_URL}/events/${event.id}/check-in?token=${token}`;

  return NextResponse.json({
    checkInUrl,
    expiresInSeconds: 30,
  });
}
