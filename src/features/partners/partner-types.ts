import type { ServiceActor } from "@/src/features/shared/service-actor";

export type PartnerStatus = "draft" | "active" | "inactive";

export type PartnerUpdateData = {
  name: string;
  category?: string | null;
  websiteUrl?: string | null;
  facebookUrl?: string | null;
  description?: string | null;
  status?: string | null;
  isOfficial?: boolean;
  logoUrl?: string | null;
  logoKey?: string | null;
};

export type UpdatePartnerInput = {
  partnerId: string;
  actor: ServiceActor;
  data: PartnerUpdateData;
};

export type PartnerAuditSnapshot = {
  name: string;
  category: string | null;
  websiteUrl: string | null;
  facebookUrl: string | null;
  description: string | null;
  status: PartnerStatus;
  isOfficial: boolean;
  logoUrl: string | null;
  logoKey: string | null;
};
