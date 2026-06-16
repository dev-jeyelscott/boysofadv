import { describe, expect, it } from "vitest";

import { BUILD_STATUSES } from "@/lib/constants/build";
import { USER_ROLES, USER_STATUSES } from "@/lib/constants/user";
import {
  canEditBuild,
  canPublishBuild,
  canSubmitBuildForReview,
} from "@/lib/permissions/build-permissions";
import { canManageMembers } from "@/lib/permissions/member-permissions";

const approvedAdmin = {
  id: "admin-1",
  role: USER_ROLES.ADMIN,
  status: USER_STATUSES.APPROVED,
};

const approvedMember = {
  id: "member-1",
  role: USER_ROLES.MEMBER,
  status: USER_STATUSES.APPROVED,
};

describe("permission helpers", () => {
  it("allows only approved admins to approve members", () => {
    expect(canManageMembers(approvedAdmin)).toBe(true);
    expect(
      canManageMembers({ ...approvedAdmin, status: USER_STATUSES.SUSPENDED }),
    ).toBe(false);
    expect(canManageMembers(approvedMember)).toBe(false);
    expect(canManageMembers(null)).toBe(false);
  });

  it("allows only admins to publish builds", () => {
    expect(canPublishBuild(approvedAdmin)).toBe(true);
    expect(canPublishBuild({ role: USER_ROLES.SUPER_ADMIN })).toBe(true);
    expect(canPublishBuild(approvedMember)).toBe(false);
    expect(canPublishBuild(null)).toBe(false);
  });

  it("allows approved owners to submit editable builds", () => {
    expect(
      canSubmitBuildForReview(approvedMember, {
        userId: approvedMember.id,
        status: BUILD_STATUSES.DRAFT,
      }),
    ).toBe(true);
  });

  it("blocks suspended members and guests from member-only build actions", () => {
    const build = {
      userId: approvedMember.id,
      status: BUILD_STATUSES.DRAFT,
    };

    expect(
      canEditBuild(
        { ...approvedMember, status: USER_STATUSES.SUSPENDED },
        build,
      ),
    ).toBe(false);
    expect(canSubmitBuildForReview(null, build)).toBe(false);
  });
});
