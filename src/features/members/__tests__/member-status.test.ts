import { describe, expect, it } from "vitest";

import { USER_STATUSES } from "@/lib/constants/user";
import { canTransitionMemberStatus } from "@/src/features/members/member-status";

describe("member status transitions", () => {
  it.each([
    [USER_STATUSES.FOR_APPROVAL, USER_STATUSES.APPROVED],
    [USER_STATUSES.FOR_APPROVAL, USER_STATUSES.REJECTED],
    [USER_STATUSES.APPROVED, USER_STATUSES.SUSPENDED],
    [USER_STATUSES.SUSPENDED, USER_STATUSES.APPROVED],
  ])("allows %s to %s", (from, to) => {
    expect(canTransitionMemberStatus(from, to)).toBe(true);
  });

  it.each([
    [USER_STATUSES.REJECTED, USER_STATUSES.APPROVED],
    [USER_STATUSES.ARCHIVED, USER_STATUSES.APPROVED],
    [USER_STATUSES.APPROVED, USER_STATUSES.FOR_APPROVAL],
  ])("rejects %s to %s", (from, to) => {
    expect(canTransitionMemberStatus(from, to)).toBe(false);
  });
});
