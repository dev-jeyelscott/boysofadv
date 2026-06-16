import { afterEach, describe, expect, it } from "vitest";

import { db } from "@/db/db";
import { builds, users } from "@/db/schema";
import { BUILD_STATUSES } from "@/lib/constants/build";
import { USER_STATUSES } from "@/lib/constants/user";
import { BuildService } from "@/src/features/builds/build-service";
import { createBuild } from "@/tests/factories/builds";
import { createApprovedMember } from "@/tests/factories/users";
import { cleanupTestDatabase, hasTestDatabase } from "./test-db";

const run = hasTestDatabase ? describe : describe.skip;

run("build submission integration", () => {
  afterEach(cleanupTestDatabase);

  it("moves an editable owner build to review and rejects invalid states", async () => {
    const owner = createApprovedMember();
    const build = createBuild({ userId: owner.id });
    await db.insert(users).values(owner);
    await db.insert(builds).values(build);

    const result = await BuildService.submitForReview({
      actor: owner,
      buildId: build.id,
    });

    expect(result.build.status).toBe(BUILD_STATUSES.FOR_REVIEW);
    await expect(
      BuildService.submitForReview({ actor: owner, buildId: build.id }),
    ).rejects.toThrow(
      "Only draft, rejected, or unpublished builds can be submitted.",
    );
  });

  it("rejects suspended owner submission", async () => {
    const owner = createApprovedMember({ status: USER_STATUSES.SUSPENDED });
    const build = createBuild({ userId: owner.id });
    await db.insert(users).values(owner);
    await db.insert(builds).values(build);

    await expect(
      BuildService.submitForReview({ actor: owner, buildId: build.id }),
    ).rejects.toThrow("Only approved members can submit builds.");
  });
});
