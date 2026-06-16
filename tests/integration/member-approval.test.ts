import { afterEach, describe, expect, it } from "vitest";

import { db } from "@/db/db";
import { users } from "@/db/schema";
import { USER_STATUSES } from "@/lib/constants/user";
import { MemberService } from "@/src/features/members/member-service";
import { createAdmin, createPendingMember } from "@/tests/factories/users";
import { cleanupTestDatabase, hasTestDatabase } from "./test-db";

const run = hasTestDatabase ? describe : describe.skip;

run("member approval integration", () => {
  afterEach(cleanupTestDatabase);

  it("approves a pending member and rejects invalid actors", async () => {
    const admin = createAdmin();
    const member = createPendingMember();
    await db.insert(users).values([admin, member]);

    await expect(
      MemberService.approve({ actor: member, memberId: member.id }),
    ).rejects.toThrow("Approved admin access is required.");

    const result = await MemberService.approve({
      actor: admin,
      memberId: member.id,
    });

    expect(result.member.status).toBe(USER_STATUSES.APPROVED);
    await expect(
      MemberService.approve({ actor: admin, memberId: member.id }),
    ).rejects.toThrow("Only members for approval can be approved.");
  });
});
