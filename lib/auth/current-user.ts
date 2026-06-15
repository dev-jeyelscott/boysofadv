import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db/db";
import { users } from "@/db/schema";

export async function getCurrentDbUser() {
  const { userId } = await auth();

  if (!userId) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, userId),
  });

  return user ?? null;
}

export async function getCurrentUserOrRedirect() {
  const user = await getCurrentDbUser();

  if (!user) {
    redirect("/sign-in");
  }

  return user;
}
