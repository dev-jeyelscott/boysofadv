import { USER_ROLES, USER_STATUSES } from "@/lib/constants/user";

type UserInput = {
  id: string;
  role: string;
  status: string;
};

export function isAdminRole(role: string) {
  return role === USER_ROLES.ADMIN || role === USER_ROLES.SUPER_ADMIN;
}

export function isApprovedUser(user: Pick<UserInput, "status"> | null) {
  return user?.status === USER_STATUSES.APPROVED;
}

export function canManageMembers(user: UserInput | null) {
  return Boolean(user && isApprovedUser(user) && isAdminRole(user.role));
}
