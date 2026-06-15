import { NextResponse } from "next/server";

import { requireApiAdmin } from "@/lib/auth/require-api-admin";
import { AttendanceService } from "@/src/features/attendance/attendance-service";
import { handleServiceError } from "@/src/lib/errors/handle-service-error";

type Props = {
  params: Promise<{
    eventId: string;
  }>;
};

export async function GET(_request: Request, { params }: Props) {
  try {
    const authResult = await requireApiAdmin();

    if (!authResult.ok) {
      return NextResponse.json(
        { message: authResult.message },
        { status: authResult.status },
      );
    }

    const { eventId } = await params;
    const result = await AttendanceService.createQrToken({
      eventId,
      actor: authResult.user,
    });

    const checkInUrl = `${process.env.NEXT_PUBLIC_APP_URL}/events/${eventId}/check-in?token=${result.token}`;

    return NextResponse.json({
      checkInUrl,
      expiresInSeconds: result.expiresInSeconds,
    });
  } catch (error) {
    return handleServiceError(error);
  }
}
