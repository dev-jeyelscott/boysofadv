import { redirect } from "next/navigation";

import { USER_ROLES, USER_STATUSES } from "@/lib/constants/user";
import { getCurrentDbUser } from "../current-user";

export async function requireAdmin() {
  const user = await getCurrentDbUser();

  if (!user) {
    redirect("/sign-in");
  }

  const isAdmin =
    user.role === USER_ROLES.ADMIN ||
    user.role === USER_ROLES.SUPER_ADMIN;

  if (!isAdmin || user.status !== USER_STATUSES.APPROVED) {
    redirect("/");
  }

  return user;
}