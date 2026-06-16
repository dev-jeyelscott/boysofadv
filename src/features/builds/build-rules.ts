import { BUILD_STATUSES, type BuildStatus } from "@/lib/constants/build";
import { USER_STATUSES } from "@/lib/constants/user";

const BUILD_STATUS_TRANSITIONS: Record<BuildStatus, readonly BuildStatus[]> = {
  [BUILD_STATUSES.DRAFT]: [BUILD_STATUSES.FOR_REVIEW, BUILD_STATUSES.ARCHIVED],
  [BUILD_STATUSES.FOR_REVIEW]: [
    BUILD_STATUSES.PUBLISHED,
    BUILD_STATUSES.REJECTED,
    BUILD_STATUSES.ARCHIVED,
  ],
  [BUILD_STATUSES.PUBLISHED]: [
    BUILD_STATUSES.UNPUBLISHED,
    BUILD_STATUSES.ARCHIVED,
  ],
  [BUILD_STATUSES.UNPUBLISHED]: [
    BUILD_STATUSES.FOR_REVIEW,
    BUILD_STATUSES.ARCHIVED,
  ],
  [BUILD_STATUSES.REJECTED]: [
    BUILD_STATUSES.FOR_REVIEW,
    BUILD_STATUSES.ARCHIVED,
  ],
  [BUILD_STATUSES.ARCHIVED]: [],
};

export type PublishableBuild = {
  status: BuildStatus;
  userId: string | null;
  title: string | null;
  motorcycleModel: string | null;
  coverImageUrl?: string | null;
};

export type PublishableBuildOwner = {
  id: string;
  status: string;
} | null;

export function canTransitionBuildStatus(from: BuildStatus, to: BuildStatus) {
  return BUILD_STATUS_TRANSITIONS[from].includes(to);
}

export function getBuildPublishBlockers(
  build: PublishableBuild,
  owner: PublishableBuildOwner,
) {
  const blockers: string[] = [];

  if (build.status !== BUILD_STATUSES.FOR_REVIEW) {
    blockers.push("Build must be for review.");
  }

  if (!owner || owner.id !== build.userId) {
    blockers.push("Build owner must exist.");
  } else if (owner.status !== USER_STATUSES.APPROVED) {
    blockers.push("Build owner must be approved.");
  }

  if (!build.title?.trim()) {
    blockers.push("Build title is required.");
  }

  if (!build.motorcycleModel?.trim()) {
    blockers.push("Motorcycle model is required.");
  }

  if (!build.coverImageUrl?.trim()) {
    blockers.push("Cover image is required.");
  }

  if (build.status === BUILD_STATUSES.ARCHIVED) {
    blockers.push("Archived builds cannot be published.");
  }

  return blockers;
}

export function canPublishBuildRecord(
  build: PublishableBuild,
  owner: PublishableBuildOwner,
) {
  return getBuildPublishBlockers(build, owner).length === 0;
}
