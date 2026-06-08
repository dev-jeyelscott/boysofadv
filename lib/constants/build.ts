export const BUILD_STATUSES = {
  DRAFT: "draft",
  FOR_REVIEW: "for_review",
  PUBLISHED: "published",
  REJECTED: "rejected",
  ARCHIVED: "archived",
  UNPUBLISHED: "unpublished",
} as const;

export type BuildStatus = (typeof BUILD_STATUSES)[keyof typeof BUILD_STATUSES];

export const ADMIN_REVIEWABLE_BUILD_STATUSES = [
  BUILD_STATUSES.FOR_REVIEW,
  BUILD_STATUSES.PUBLISHED,
  BUILD_STATUSES.REJECTED,
] as const;

export type AdminBuildRow = {
  id: string;
  title: string;
  status: "rejected" | "draft" | "for_review" | "published" | "archived";
  isFeatured: boolean;
  coverImageUrl: string | null;

  motorcycleModel: string;
  yearModel: string | null;
  concept: string | null;
  description: string | null;

  engineSetup: string | null;
  cvtSetup: string | null;
  suspensionSetup: string | null;
  brakingSetup?: string | null;
  wheelSetup: string | null;

  createdAt: Date;
  updatedAt: Date;

  ownerId: string;
  ownerEmail: string;
  ownerFirstName: string | null;
  ownerLastName: string | null;
  ownerNickname: string | null;
  ownerCodename: string | null;
};

export type BuildsFiltersState = {
  search: string;
  model: string;
  concept: string;
  status: string;
  isFeatured: string;
};
