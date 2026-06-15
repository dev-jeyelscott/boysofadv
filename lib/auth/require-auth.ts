import { auth } from "@clerk/nextjs/server";

export async function requireAuth() {
  const authResult = await auth();

  if (!authResult.userId) {
    throw new Error("Unauthorized");
  }

  return authResult;
}
