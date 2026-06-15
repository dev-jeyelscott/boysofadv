import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/db/db";
import { eventAttendance, events } from "@/db/schema";
import { getCurrentDbUser } from "@/lib/current-user";
import { verifyAttendanceToken } from "@/lib/attendance-token";
import { USER_STATUSES } from "@/lib/constants/user";
import { calculateDistanceMeters } from "@/lib/geo";

type Props = {
  params: Promise<{
    eventId: string;
  }>;
};

type CheckInBody = {
  token?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
};

export async function POST(request: Request, { params }: Props) {
  const { eventId } = await params;

  const user = await getCurrentDbUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  if (user.status !== USER_STATUSES.APPROVED) {
    return NextResponse.json(
      { message: "Only approved members can check in." },
      { status: 403 },
    );
  }

  const body = (await request.json()) as CheckInBody;

  if (!body.token) {
    return NextResponse.json(
      { message: "Missing attendance token." },
      { status: 400 },
    );
  }

  if (
    typeof body.latitude !== "number" ||
    typeof body.longitude !== "number" ||
    Number.isNaN(body.latitude) ||
    Number.isNaN(body.longitude)
  ) {
    return NextResponse.json(
      { message: "Invalid GPS location." },
      { status: 400 },
    );
  }

  const tokenPayload = verifyAttendanceToken(body.token, eventId);

  if (!tokenPayload) {
    return NextResponse.json(
      { message: "Invalid or expired QR code. Please scan the latest QR." },
      { status: 400 },
    );
  }

  const [event] = await db
    .select({
      id: events.id,
      title: events.title,
      status: events.status,
      startsAt: events.startsAt,
      endsAt: events.endsAt,
      latitude: events.latitude,
      longitude: events.longitude,
      geoRadiusMeters: events.geoRadiusMeters,
    })
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (!event) {
    return NextResponse.json({ message: "Event not found." }, { status: 404 });
  }

  if (event.status !== "published") {
    return NextResponse.json(
      {
        message: "Attendance is not available for this event.",
      },
      { status: 400 },
    );
  }

  if (!event.startsAt || !event.endsAt) {
    return NextResponse.json(
      {
        message: "Event schedule is not configured.",
      },
      { status: 400 },
    );
  }

  const now = new Date();

  const attendanceOpen = now >= event.startsAt && now <= event.endsAt;

  if (!attendanceOpen) {
    return NextResponse.json(
      {
        message: "Attendance is currently closed.",
      },
      { status: 400 },
    );
  }

  if (!event.latitude || !event.longitude) {
    return NextResponse.json(
      { message: "Event GPS location is not configured." },
      { status: 400 },
    );
  }

  const eventLatitude = Number(event.latitude);
  const eventLongitude = Number(event.longitude);
  const geoRadiusMeters = Number(event.geoRadiusMeters ?? 80);

  const distanceMeters = calculateDistanceMeters({
    fromLatitude: body.latitude,
    fromLongitude: body.longitude,
    toLatitude: eventLatitude,
    toLongitude: eventLongitude,
  });

  if (distanceMeters > geoRadiusMeters) {
    return NextResponse.json(
      {
        message: `You are too far from the event location. Distance: ${Math.round(
          distanceMeters,
        )}m. Allowed radius: ${geoRadiusMeters}m.`,
      },
      { status: 403 },
    );
  }

  const [existingAttendance] = await db
    .select({
      id: eventAttendance.id,
    })
    .from(eventAttendance)
    .where(
      and(
        eq(eventAttendance.eventId, eventId),
        eq(eventAttendance.userId, user.id),
      ),
    )
    .limit(1);

  if (existingAttendance) {
    return NextResponse.json(
      { message: "You are already checked in for this event." },
      { status: 409 },
    );
  }

  await db.insert(eventAttendance).values({
    eventId,
    userId: user.id,
    status: "checked_in",
    checkInLatitude: body.latitude.toString(),
    checkInLongitude: body.longitude.toString(),
    gpsAccuracyMeters:
      typeof body.accuracy === "number" ? body.accuracy.toString() : null,
    distanceMeters: distanceMeters.toFixed(2),
  });

  return NextResponse.json({
    message: "Attendance recorded successfully.",
  });
}
