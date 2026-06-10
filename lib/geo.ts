export function calculateDistanceMeters(params: {
  fromLatitude: number;
  fromLongitude: number;
  toLatitude: number;
  toLongitude: number;
}) {
  const earthRadius = 6371000;

  const lat1 = toRadians(params.fromLatitude);
  const lat2 = toRadians(params.toLatitude);

  const deltaLat = toRadians(params.toLatitude - params.fromLatitude);

  const deltaLon = toRadians(params.toLongitude - params.fromLongitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}
