import { NextResponse } from "next/server";

import { requireApiApprovedUser } from "@/lib/auth/require-api-approved-user";
import { NotificationService } from "@/src/features/notifications/notification-service";
import { handleServiceError } from "@/src/lib/errors/handle-service-error";

export async function POST(request: Request) {
  try {
    const authResult = await requireApiApprovedUser();

    if (!authResult.ok) {
      return NextResponse.json(
        { message: authResult.message },
        { status: authResult.status },
      );
    }

    const body = (await request.json()) as { endpoint?: string };

    await NotificationService.unregisterSubscription({
      userId: authResult.user.id,
      endpoint: body.endpoint ?? "",
    });

    return NextResponse.json({ message: "Push notification disabled." });
  } catch (error) {
    return handleServiceError(error);
  }
}
