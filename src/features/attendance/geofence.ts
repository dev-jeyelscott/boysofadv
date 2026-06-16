import { calculateDistanceMeters } from "@/lib/geo";

export type GeofenceCheckInput = {
  eventLatitude?: number | string | null;
  eventLongitude?: number | string | null;
  radiusMeters?: number | null;
  userLatitude?: number | null;
  userLongitude?: number | null;
  gpsAccuracyMeters?: number | null;
  maxGpsAccuracyMeters?: number;
};

export type GeofenceCheckResult =
  | { allowed: true; reason: "inside_radius"; distanceMeters: number }
  | {
      allowed: false;
      reason:
        | "missing_user_coordinates"
        | "weak_gps_accuracy"
        | "geofence_not_configured"
        | "outside_radius";
      distanceMeters?: number;
    };

export function checkEventGeofence(
  input: GeofenceCheckInput,
): GeofenceCheckResult {
  if (
    typeof input.userLatitude !== "number" ||
    typeof input.userLongitude !== "number"
  ) {
    return { allowed: false, reason: "missing_user_coordinates" };
  }

  if (
    typeof input.gpsAccuracyMeters === "number" &&
    input.gpsAccuracyMeters >
      (input.maxGpsAccuracyMeters ?? input.radiusMeters ?? 80)
  ) {
    return { allowed: false, reason: "weak_gps_accuracy" };
  }

  if (!input.eventLatitude || !input.eventLongitude || !input.radiusMeters) {
    return { allowed: false, reason: "geofence_not_configured" };
  }

  const distanceMeters = calculateDistanceMeters({
    fromLatitude: input.userLatitude,
    fromLongitude: input.userLongitude,
    toLatitude: Number(input.eventLatitude),
    toLongitude: Number(input.eventLongitude),
  });

  if (distanceMeters > input.radiusMeters) {
    return {
      allowed: false,
      reason: "outside_radius",
      distanceMeters,
    };
  }

  return { allowed: true, reason: "inside_radius", distanceMeters };
}
