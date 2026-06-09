import { redirect } from "next/navigation";

import { USER_STATUSES } from "@/lib/constants/user";
import { getCurrentDbUser } from "../current-user";

export async function requireApprovedUser() {
  const user = await getCurrentDbUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (user.status !== USER_STATUSES.APPROVED) {
    redirect("/pending-approval");
  }

  return user;
}
