import type { PushPayload } from "@/lib/push";

export type NotificationPayload = PushPayload;

export type PushSubscriptionInput = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export type NotificationDeliverySummary = {
  attempted: number;
  sent: number;
  failed: number;
  removedSubscriptions: number;
};
