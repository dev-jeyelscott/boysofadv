import { NextResponse } from "next/server";

import { requireApiApprovedUser } from "@/lib/auth/require-api-approved-user";
import { NotificationService } from "@/src/features/notifications/notification-service";
import { pushSubscriptionSchema } from "@/src/features/notifications/notification-validation";
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

    const subscription = pushSubscriptionSchema.parse(await request.json());

    await NotificationService.registerSubscription({
      userId: authResult.user.id,
      subscription,
    });

    return NextResponse.json({ message: "Push notification enabled." });
  } catch (error) {
    return handleServiceError(error);
  }
}
