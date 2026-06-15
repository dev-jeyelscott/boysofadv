import { USER_ROLES, USER_STATUSES, type UserRole } from "@/lib/constants/user";
import { ServiceError } from "@/src/lib/errors/service-error";

export type ServiceActor = {
  id: string;
  role: string;
  status: string;
};

export function assertApprovedAdmin(actor: ServiceActor) {
  const isAdmin =
    actor.role === USER_ROLES.ADMIN || actor.role === USER_ROLES.SUPER_ADMIN;

  if (!isAdmin || actor.status !== USER_STATUSES.APPROVED) {
    throw new ServiceError("FORBIDDEN", "Approved admin access is required.");
  }
}

export function assertSuperAdmin(actor: ServiceActor) {
  if (
    actor.role !== USER_ROLES.SUPER_ADMIN ||
    actor.status !== USER_STATUSES.APPROVED
  ) {
    throw new ServiceError("FORBIDDEN", "Super admin access is required.");
  }
}

export function isUserRole(value: string): value is UserRole {
  return Object.values(USER_ROLES).includes(value as UserRole);
}
