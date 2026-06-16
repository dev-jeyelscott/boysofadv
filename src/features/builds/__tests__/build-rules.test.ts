import { describe, expect, it } from "vitest";

import { BUILD_STATUSES } from "@/lib/constants/build";
import { USER_STATUSES } from "@/lib/constants/user";
import {
  canPublishBuildRecord,
  canTransitionBuildStatus,
  getBuildPublishBlockers,
} from "@/src/features/builds/build-rules";

describe("build status transitions", () => {
  it.each([
    [BUILD_STATUSES.DRAFT, BUILD_STATUSES.FOR_REVIEW],
    [BUILD_STATUSES.FOR_REVIEW, BUILD_STATUSES.PUBLISHED],
    [BUILD_STATUSES.FOR_REVIEW, BUILD_STATUSES.REJECTED],
    [BUILD_STATUSES.PUBLISHED, BUILD_STATUSES.UNPUBLISHED],
    [BUILD_STATUSES.UNPUBLISHED, BUILD_STATUSES.FOR_REVIEW],
  ])("allows %s to %s", (from, to) => {
    expect(canTransitionBuildStatus(from, to)).toBe(true);
  });

  it.each([
    [BUILD_STATUSES.DRAFT, BUILD_STATUSES.PUBLISHED],
    [BUILD_STATUSES.REJECTED, BUILD_STATUSES.PUBLISHED],
    [BUILD_STATUSES.PUBLISHED, BUILD_STATUSES.DRAFT],
    [BUILD_STATUSES.ARCHIVED, BUILD_STATUSES.PUBLISHED],
  ])("rejects %s to %s", (from, to) => {
    expect(canTransitionBuildStatus(from, to)).toBe(false);
  });
});

describe("build publishing rules", () => {
  const build = {
    status: BUILD_STATUSES.FOR_REVIEW,
    userId: "member-1",
    title: "ADV 160 Touring",
    motorcycleModel: "ADV 160",
    coverImageUrl: "https://example.com/cover.jpg",
  };

  const owner = {
    id: "member-1",
    status: USER_STATUSES.APPROVED,
  };

  it("allows a complete build from an approved owner", () => {
    expect(canPublishBuildRecord(build, owner)).toBe(true);
  });

  it("rejects draft builds", () => {
    expect(
      getBuildPublishBlockers(
        { ...build, status: BUILD_STATUSES.DRAFT },
        owner,
      ),
    ).toContain("Build must be for review.");
  });

  it("rejects rejected builds", () => {
    expect(
      canPublishBuildRecord(
        { ...build, status: BUILD_STATUSES.REJECTED },
        owner,
      ),
    ).toBe(false);
  });

  it("rejects suspended owners", () => {
    expect(
      getBuildPublishBlockers(build, {
        ...owner,
        status: USER_STATUSES.SUSPENDED,
      }),
    ).toContain("Build owner must be approved.");
  });

  it("rejects missing required fields", () => {
    expect(
      getBuildPublishBlockers(
        { ...build, title: "", motorcycleModel: "", coverImageUrl: null },
        owner,
      ),
    ).toEqual(
      expect.arrayContaining([
        "Build title is required.",
        "Motorcycle model is required.",
        "Cover image is required.",
      ]),
    );
  });
});
