import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    redirect("/sign-in");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });

  if (!user) {
    redirect("/pending-approval");
  }

  if (user.status !== "approved") {
    redirect("/pending-approval");
  }

  return user;
}