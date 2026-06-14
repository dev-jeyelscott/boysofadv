import { lt } from "drizzle-orm";

import { db } from "@/db/db";
import { pushSubscriptions } from "@/db/schema";

const DEFAULT_EXPIRY_DAYS = 90;

export async function cleanupExpiredPushSubscriptions(
  expiryDays = DEFAULT_EXPIRY_DAYS,
) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() - expiryDays);

  const deletedSubscriptions = await db
    .delete(pushSubscriptions)
    .where(lt(pushSubscriptions.updatedAt, expiryDate))
    .returning({
      id: pushSubscriptions.id,
      userId: pushSubscriptions.userId,
      endpoint: pushSubscriptions.endpoint,
      updatedAt: pushSubscriptions.updatedAt,
    });

  return {
    expiryDays,
    expiryDate,
    deleted: deletedSubscriptions.length,
    deletedSubscriptions,
  };
}
