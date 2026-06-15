export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MEMBER: "member",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const USER_ROLE_VALUES = Object.values(USER_ROLES);

export const USER_STATUSES = {
  FOR_APPROVAL: "for_approval",
  APPROVED: "approved",
  REJECTED: "rejected",
  SUSPENDED: "suspended",
  ARCHIVED: "archived",
} as const;

export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES];

export const USER_STATUS_VALUES = Object.values(USER_STATUSES);
