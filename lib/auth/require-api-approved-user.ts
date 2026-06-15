import { USER_STATUSES } from "@/lib/constants/user";
import { requireApiAuth } from "./require-api-auth";

export async function requireApiApprovedUser() {
  const authResult = await requireApiAuth();

  if (!authResult.ok) {
    return authResult;
  }

  if (authResult.user.status !== USER_STATUSES.APPROVED) {
    return {
      ok: false,
      status: 403,
      message: "Only approved members can access this resource.",
    } as const;
  }

  return authResult;
}
