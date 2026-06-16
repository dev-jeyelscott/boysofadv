import { describe, expect, it } from "vitest";

import { checkEventGeofence } from "@/src/features/attendance/geofence";

const eventLocation = {
  eventLatitude: 14.5995,
  eventLongitude: 120.9842,
  radiusMeters: 100,
};

describe("event geofence checks", () => {
  it("allows a user inside the radius", () => {
    expect(
      checkEventGeofence({
        ...eventLocation,
        userLatitude: 14.5995,
        userLongitude: 120.9842,
        gpsAccuracyMeters: 20,
      }),
    ).toMatchObject({ allowed: true, reason: "inside_radius" });
  });

  it("rejects a user outside the radius", () => {
    expect(
      checkEventGeofence({
        ...eventLocation,
        userLatitude: 14.6042,
        userLongitude: 120.9822,
        gpsAccuracyMeters: 20,
      }),
    ).toMatchObject({ allowed: false, reason: "outside_radius" });
  });

  it("rejects missing GPS coordinates", () => {
    expect(checkEventGeofence(eventLocation)).toEqual({
      allowed: false,
      reason: "missing_user_coordinates",
    });
  });

  it("rejects weak GPS accuracy", () => {
    expect(
      checkEventGeofence({
        ...eventLocation,
        userLatitude: 14.5995,
        userLongitude: 120.9842,
        gpsAccuracyMeters: 250,
      }),
    ).toEqual({ allowed: false, reason: "weak_gps_accuracy" });
  });

  it("rejects events without a configured geofence", () => {
    expect(
      checkEventGeofence({
        userLatitude: 14.5995,
        userLongitude: 120.9842,
      }),
    ).toEqual({ allowed: false, reason: "geofence_not_configured" });
  });
});
