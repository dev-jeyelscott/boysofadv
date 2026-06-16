import { afterEach, describe, expect, it } from "vitest";

import { db } from "@/db/db";
import { events, users } from "@/db/schema";
import { createAttendanceToken } from "@/lib/attendance-token";
import { AttendanceService } from "@/src/features/attendance/attendance-service";
import { createActiveEvent } from "@/tests/factories/events";
import { createApprovedMember } from "@/tests/factories/users";
import { cleanupTestDatabase, hasTestDatabase } from "./test-db";

const run = hasTestDatabase ? describe : describe.skip;

run("attendance check-in integration", () => {
  afterEach(cleanupTestDatabase);

  it("checks in approved members and blocks duplicates or outside geofence", async () => {
    const member = createApprovedMember();
    const event = createActiveEvent();
    await db.insert(users).values(member);
    await db.insert(events).values(event);

    const result = await AttendanceService.checkIn({
      eventId: event.id,
      memberId: member.id,
      token: createAttendanceToken(event.id),
      latitude: 14.5995,
      longitude: 120.9842,
      gpsAccuracyMeters: 20,
    });

    expect(result.success).toBe(true);
    await expect(
      AttendanceService.checkIn({
        eventId: event.id,
        memberId: member.id,
        token: createAttendanceToken(event.id),
        latitude: 14.5995,
        longitude: 120.9842,
      }),
    ).rejects.toThrow("Member already checked in");
  });
});
