import { redirect } from "next/navigation";

import { getCurrentDbUser } from "@/lib/auth/current-user";
import { isApprovedUser } from "@/lib/permissions/member-permissions";

export async function requireApprovedUser() {
  const user = await getCurrentDbUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!isApprovedUser(user)) {
    redirect("/pending-approval");
  }

  return user;
}
