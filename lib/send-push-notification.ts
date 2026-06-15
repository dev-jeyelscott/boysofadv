import { NotificationService } from "@/src/features/notifications/notification-service";
import type { PushPayload } from "@/lib/push";

type LegacyPushSummary = {
  total: number;
  success: number;
  failed: number;
};

function toLegacySummary(summary: {
  attempted: number;
  sent: number;
  failed: number;
}): LegacyPushSummary {
  return {
    total: summary.attempted,
    success: summary.sent,
    failed: summary.failed,
  };
}

export async function sendPushNotificationToUser(
  userId: string,
  payload: PushPayload,
) {
  const summary = await NotificationService.notifyUser({ userId, payload });

  return toLegacySummary(summary);
}

export async function sendPushNotificationToAllApprovedUsers(
  payload: PushPayload,
) {
  const summary = await NotificationService.notifyApprovedMembers({ payload });

  return toLegacySummary(summary);
}

export async function sendPushNotificationToAllAdmins(payload: PushPayload) {
  const summary = await NotificationService.notifyAdmins({ payload });

  return toLegacySummary(summary);
}
