import { randomUUID } from "crypto";

export function createAttendance(overrides = {}) {
  return {
    eventId: randomUUID(),
    userId: randomUUID(),
    status: "checked_in",
    checkInLatitude: "14.5995000",
    checkInLongitude: "120.9842000",
    gpsAccuracyMeters: "20",
    distanceMeters: "0.00",
    ...overrides,
  };
}
