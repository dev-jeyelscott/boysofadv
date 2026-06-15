import { NextResponse } from "next/server";

import { getCurrentDbUser } from "@/lib/current-user";
import { AttendanceService } from "@/src/features/attendance/attendance-service";
import { handleServiceError } from "@/src/lib/errors/handle-service-error";

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
  try {
    const { eventId } = await params;
    const user = await getCurrentDbUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as CheckInBody;
    const result = await AttendanceService.checkIn({
      eventId,
      memberId: user.id,
      token: body.token ?? "",
      latitude: body.latitude as number,
      longitude: body.longitude as number,
      gpsAccuracyMeters: body.accuracy ?? null,
    });

    return NextResponse.json({
      message: "Attendance recorded successfully.",
      attendance: result.attendance,
    });
  } catch (error) {
    return handleServiceError(error);
  }
}
