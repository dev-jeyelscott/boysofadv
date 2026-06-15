import type { ServiceActor } from "@/src/features/shared/service-actor";

export type AttendanceCheckInInput = {
  eventId: string;
  memberId: string;
  token: string;
  latitude: number;
  longitude: number;
  gpsAccuracyMeters?: number | null;
};

export type EventAttendanceInput = {
  eventId: string;
  actor: ServiceActor;
};

export type RemoveAttendanceInput = EventAttendanceInput & {
  memberId: string;
};
