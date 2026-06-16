import { NextResponse } from "next/server";

import { requireApiApprovedUser } from "@/lib/auth/require-api-approved-user";
import { NotificationService } from "@/src/features/notifications/notification-service";
import { handleServiceError } from "@/src/lib/errors/handle-service-error";

export async function GET() {
  try {
    const authResult = await requireApiApprovedUser();

    if (!authResult.ok) {
      return NextResponse.json(
        { enabled: false },
        { status: authResult.status },
      );
    }

    const status = await NotificationService.getSubscriptionStatus({
      userId: authResult.user.id,
    });

    return NextResponse.json(status);
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requireApiApprovedUser();

    if (!authResult.ok) {
      return NextResponse.json(
        { enabled: false },
        { status: authResult.status },
      );
    }

    const body = (await request.json().catch(() => ({}))) as {
      endpoint?: string;
    };

    const status = await NotificationService.getSubscriptionStatus({
      userId: authResult.user.id,
      endpoint: body.endpoint,
    });

    return NextResponse.json(status);
  } catch (error) {
    return handleServiceError(error);
  }
}
