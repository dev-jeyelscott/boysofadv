import { USER_ROLES, USER_STATUSES } from "@/lib/constants/user";
import { requireApiAuth } from "./require-api-auth";

export async function requireApiAdmin() {
  const authResult = await requireApiAuth();

  if (!authResult.ok) {
    return authResult;
  }

  const isAdmin =
    authResult.user.role === USER_ROLES.ADMIN ||
    authResult.user.role === USER_ROLES.SUPER_ADMIN;

  if (!isAdmin || authResult.user.status !== USER_STATUSES.APPROVED) {
    return {
      ok: false,
      status: 403,
      message: "Forbidden.",
    } as const;
  }

  return authResult;
}
