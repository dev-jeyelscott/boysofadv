export type EventRow = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  geoRadiusMeters?: number | null;
  startsAt: Date | string;
  endsAt: Date | string | null;
  status: string;
  posterImageUrl: string | null;
  posterImageKey: string | null;
  createdAt: Date | string;
};

export const EVENT_STATUSES = {
  DRAFT: "draft",
  PUBLISHED: "published",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const EVENT_STATUS_VALUES = Object.values(EVENT_STATUSES);

export type EventStatus = (typeof EVENT_STATUSES)[keyof typeof EVENT_STATUSES];

export const EVENT_DISPLAY_STATUSES = {
  DRAFT: "draft",
  UPCOMING: "upcoming",
  ONGOING: "ongoing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type EventDisplayStatus =
  (typeof EVENT_DISPLAY_STATUSES)[keyof typeof EVENT_DISPLAY_STATUSES];

export function isEventStatus(value: string): value is EventStatus {
  return EVENT_STATUS_VALUES.includes(value as EventStatus);
}
