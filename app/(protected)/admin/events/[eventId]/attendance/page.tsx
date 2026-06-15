import { notFound } from "next/navigation";
import { eq, desc } from "drizzle-orm";

import AdminPageShell from "@/components/admin/admin-page-shell";
import { db } from "@/db/db";
import { eventAttendance, events, users } from "@/db/schema";
import { EventAttendanceClient } from "./event-attendance-client";

type Props = {
  params: Promise<{
    eventId: string;
  }>;
};

export default async function EventAttendancePage({ params }: Props) {
  const { eventId } = await params;

  const [event] = await db
    .select({
      id: events.id,
      title: events.title,
      location: events.location,
      startsAt: events.startsAt,
      endsAt: events.endsAt,
      status: events.status,
      posterImageUrl: events.posterImageUrl,
    })
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (!event) {
    notFound();
  }

  const attendance = await db
    .select({
      id: eventAttendance.id,
      status: eventAttendance.status,
      checkedInAt: eventAttendance.checkedInAt,
      distanceMeters: eventAttendance.distanceMeters,
      firstName: users.firstName,
      lastName: users.lastName,
      nickname: users.nickname,
      email: users.email,
    })
    .from(eventAttendance)
    .leftJoin(users, eq(eventAttendance.userId, users.id))
    .where(eq(eventAttendance.eventId, eventId))
    .orderBy(desc(eventAttendance.checkedInAt));

  return (
    <AdminPageShell
      title="Attendance Tracking"
      description="Generate secure rotating QR codes for tambike attendance."
    >
      <EventAttendanceClient event={event} attendance={attendance} />
    </AdminPageShell>
  );
}
