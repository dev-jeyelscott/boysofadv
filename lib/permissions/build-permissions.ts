import { BUILD_STATUSES } from "@/lib/constants/build";
import { USER_STATUSES } from "@/lib/constants/user";
import { isAdminRole } from "./member-permissions";

type UserInput = {
  id: string;
  role: string;
  status?: string;
};

type BuildInput = {
  userId: string;
  status: string;
};

const OWNER_EDITABLE_STATUSES = [
  BUILD_STATUSES.DRAFT,
  BUILD_STATUSES.REJECTED,
  BUILD_STATUSES.UNPUBLISHED,
] as const;

type OwnerEditableBuildStatus = (typeof OWNER_EDITABLE_STATUSES)[number];

function isOwnerEditableBuildStatus(
  status: string,
): status is OwnerEditableBuildStatus {
  return (OWNER_EDITABLE_STATUSES as readonly string[]).includes(status);
}

export function canManageBuild(user: UserInput | null, build: BuildInput) {
  return Boolean(user && (isAdminRole(user.role) || user.id === build.userId));
}

export function canEditBuild(user: UserInput | null, build: BuildInput) {
  return Boolean(
    user &&
    user.id === build.userId &&
    user.status === USER_STATUSES.APPROVED &&
    isOwnerEditableBuildStatus(build.status),
  );
}

export function canSubmitBuildForReview(
  user: UserInput | null,
  build: BuildInput,
) {
  return canEditBuild(user, build);
}

export function canPublishBuild(user: Pick<UserInput, "role"> | null) {
  return Boolean(user && isAdminRole(user.role));
}

export function canArchiveBuild(user: Pick<UserInput, "role"> | null) {
  return canPublishBuild(user);
}
