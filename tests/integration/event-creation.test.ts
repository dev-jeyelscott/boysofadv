import { afterEach, describe, expect, it } from "vitest";

import { db } from "@/db/db";
import { users } from "@/db/schema";
import { EVENT_STATUSES } from "@/lib/constants/event";
import { EventService } from "@/src/features/events/event-service";
import { createEvent } from "@/tests/factories/events";
import { createAdmin, createApprovedMember } from "@/tests/factories/users";
import { cleanupTestDatabase, hasTestDatabase } from "./test-db";

const run = hasTestDatabase ? describe : describe.skip;

run("event creation integration", () => {
  afterEach(cleanupTestDatabase);

  it("creates draft events for admins and rejects invalid actors or schedules", async () => {
    const admin = createAdmin();
    const member = createApprovedMember();
    await db.insert(users).values([admin, member]);

    await expect(
      EventService.create({ actor: member, data: createEvent() }),
    ).rejects.toThrow("Approved admin access is required.");

    await expect(
      EventService.create({
        actor: admin,
        data: createEvent({
          startsAt: new Date("2026-01-02T00:00:00.000Z"),
          endsAt: new Date("2026-01-01T00:00:00.000Z"),
        }),
        allowPastStart: true,
      }),
    ).rejects.toThrow("Event start time must be before end time.");

    const result = await EventService.create({
      actor: admin,
      data: createEvent(),
    });

    expect(result.event.status).toBe(EVENT_STATUSES.DRAFT);
  });
});
