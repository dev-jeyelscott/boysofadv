import { USER_STATUSES } from "@/lib/constants/user";
import { isAdminRole } from "./member-permissions";

type UserInput = {
  id: string;
  role: string;
  status: string;
};

type CommentInput = {
  userId: string;
  deletedAt: Date | null;
};

export function canInteractWithBuildComment(user: UserInput | null) {
  return user?.status === USER_STATUSES.APPROVED;
}

export function canDeleteBuildComment(
  user: UserInput | null,
  comment: CommentInput,
) {
  if (!user) {
    return false;
  }

  if (!canInteractWithBuildComment(user) || comment.deletedAt) {
    return false;
  }

  return user.id === comment.userId || isAdminRole(user.role);
}
