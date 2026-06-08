import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { users } from "@/db/schema";

export async function getCurrentDbUser() {
  const { userId } = await auth();

  if (!userId) return null;

  const [dbUser] = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, userId))
    .limit(1);

  return dbUser ?? null;
}