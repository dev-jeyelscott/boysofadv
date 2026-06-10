import crypto from "crypto";

const ATTENDANCE_TOKEN_SECRET =
  process.env.ATTENDANCE_TOKEN_SECRET ?? process.env.AUTH_SECRET;

if (!ATTENDANCE_TOKEN_SECRET) {
  throw new Error("Missing ATTENDANCE_TOKEN_SECRET or AUTH_SECRET");
}

type AttendanceTokenPayload = {
  eventId: string;
  nonce: string;
  expiresAt: number;
};

function base64url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function sign(value: string) {
  return crypto
    .createHmac("sha256", ATTENDANCE_TOKEN_SECRET!)
    .update(value)
    .digest("base64url");
}

export function createAttendanceToken(eventId: string) {
  const payload: AttendanceTokenPayload = {
    eventId,
    nonce: crypto.randomUUID(),
    expiresAt: Date.now() + 30_000,
  };

  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyAttendanceToken(token: string, eventId: string) {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    )
  ) {
    return null;
  }

  const payload = JSON.parse(
    Buffer.from(encodedPayload, "base64url").toString(),
  ) as AttendanceTokenPayload;

  if (payload.eventId !== eventId) {
    return null;
  }

  if (payload.expiresAt < Date.now()) {
    return null;
  }

  return payload;
}
