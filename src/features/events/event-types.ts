import type { ServiceActor } from "@/src/features/shared/service-actor";

export type EventDataInput = {
  title: string;
  description: string;
  startsAt: Date;
  endsAt?: Date | null;
  location: string;
  latitude?: string | null;
  longitude?: string | null;
  geoRadiusMeters?: number;
  posterImageUrl?: string | null;
  posterImageKey?: string | null;
};

export type CreateEventInput = {
  actor: ServiceActor;
  data: EventDataInput;
  allowPastStart?: boolean;
};

export type UpdateEventInput = {
  eventId: string;
  actor: ServiceActor;
  data: EventDataInput;
  allowPastStart?: boolean;
};

export type EventTransitionInput = {
  eventId: string;
  actor: ServiceActor;
};

export type CancelEventInput = EventTransitionInput & {
  reason: string;
};
