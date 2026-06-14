import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function touchUserActivity(userId: string) {
  const now = new Date();

  await db
    .update(users)
    .set({
      lastActiveAt: now,
      inactiveDetectedAt: null,
      updatedAt: now,
    })
    .where(eq(users.id, userId));
}
