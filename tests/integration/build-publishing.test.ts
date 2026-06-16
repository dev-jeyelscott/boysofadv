import { afterEach, describe, expect, it } from "vitest";

import { db } from "@/db/db";
import { builds, users } from "@/db/schema";
import { BUILD_STATUSES } from "@/lib/constants/build";
import { BuildService } from "@/src/features/builds/build-service";
import { createSubmittedBuild } from "@/tests/factories/builds";
import { createAdmin, createApprovedMember } from "@/tests/factories/users";
import { cleanupTestDatabase, hasTestDatabase } from "./test-db";

const run = hasTestDatabase ? describe : describe.skip;

run("build publishing integration", () => {
  afterEach(cleanupTestDatabase);

  it("allows admins to publish submitted builds and blocks members", async () => {
    const admin = createAdmin();
    const owner = createApprovedMember();
    const build = createSubmittedBuild({ userId: owner.id });
    await db.insert(users).values([admin, owner]);
    await db.insert(builds).values(build);

    await expect(
      BuildService.publish({ actor: owner, buildId: build.id }),
    ).rejects.toThrow("Approved admin access is required.");

    const result = await BuildService.publish({
      actor: admin,
      buildId: build.id,
    });

    expect(result.build.status).toBe(BUILD_STATUSES.PUBLISHED);
  });
});
