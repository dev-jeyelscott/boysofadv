import { redirect } from "next/navigation";

import { getCurrentDbUser } from "@/lib/auth/current-user";
import { canManageMembers } from "@/lib/permissions/member-permissions";

export async function requireAdmin() {
  const user = await getCurrentDbUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!canManageMembers(user)) {
    redirect("/");
  }

  return user;
}
