import { USER_STATUSES } from "@/lib/constants/user";
import { isAdminRole } from "./member-permissions";

type UserInput = {
  role: string;
  status: string;
};

export function canManagePartners(user: UserInput | null) {
  return Boolean(
    user && user.status === USER_STATUSES.APPROVED && isAdminRole(user.role),
  );
}
