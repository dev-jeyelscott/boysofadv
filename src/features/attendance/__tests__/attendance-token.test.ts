import { describe, expect, it, vi } from "vitest";

import {
  createAttendanceToken,
  verifyAttendanceToken,
} from "@/lib/attendance-token";

describe("QR attendance token validation", () => {
  it("accepts a valid token", () => {
    const token = createAttendanceToken("event-1");

    expect(verifyAttendanceToken(token, "event-1")).toMatchObject({
      eventId: "event-1",
    });
  });

  it("rejects an expired token", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const token = createAttendanceToken("event-1");

    vi.setSystemTime(new Date("2026-01-01T00:00:31.000Z"));
    expect(verifyAttendanceToken(token, "event-1")).toBeNull();
    vi.useRealTimers();
  });

  it("rejects malformed tokens", () => {
    expect(verifyAttendanceToken("bad-token", "event-1")).toBeNull();
  });

  it("rejects tokens for the wrong event", () => {
    const token = createAttendanceToken("event-1");

    expect(verifyAttendanceToken(token, "event-2")).toBeNull();
  });

  it("rejects reused tokens after the valid time window", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const token = createAttendanceToken("event-1");

    expect(verifyAttendanceToken(token, "event-1")).not.toBeNull();
    vi.setSystemTime(new Date("2026-01-01T00:00:31.000Z"));
    expect(verifyAttendanceToken(token, "event-1")).toBeNull();
    vi.useRealTimers();
  });
});
