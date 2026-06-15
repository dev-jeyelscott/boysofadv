export type PartnerRow = {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  logoUrl: string | null;
  logoKey: string | null;
  isOfficial: boolean;
  status: "draft" | "active" | "inactive";
  websiteUrl: string | null;
  facebookUrl: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};
