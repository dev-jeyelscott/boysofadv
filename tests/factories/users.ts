import { randomUUID } from "crypto";

import { USER_ROLES, USER_STATUSES } from "@/lib/constants/user";

export function createTestUser(overrides = {}) {
  const id = randomUUID();

  return {
    id,
    clerkUserId: `clerk_${id}`,
    email: `${id}@example.com`,
    role: USER_ROLES.MEMBER,
    status: USER_STATUSES.FOR_APPROVAL,
    ...overrides,
  };
}

export function createApprovedMember(overrides = {}) {
  return createTestUser({
    role: USER_ROLES.MEMBER,
    status: USER_STATUSES.APPROVED,
    ...overrides,
  });
}

export function createPendingMember(overrides = {}) {
  return createTestUser({
    role: USER_ROLES.MEMBER,
    status: USER_STATUSES.FOR_APPROVAL,
    ...overrides,
  });
}

export function createAdmin(overrides = {}) {
  return createTestUser({
    role: USER_ROLES.ADMIN,
    status: USER_STATUSES.APPROVED,
    ...overrides,
  });
}

export function createSuperAdmin(overrides = {}) {
  return createTestUser({
    role: USER_ROLES.SUPER_ADMIN,
    status: USER_STATUSES.APPROVED,
    ...overrides,
  });
}
