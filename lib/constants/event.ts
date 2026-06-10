export type EventRow = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  geoRadiusMeters?: number | null;
  startDate: Date | string;
  endDate: Date | string | null;
  status: string;
  posterImageUrl: string | null;
  posterImageKey: string | null;
  createdAt: Date | string;
};

export const EVENT_STATUSES = [
  "draft",
  "published",
  "completed",
  "cancelled",
] as const;
