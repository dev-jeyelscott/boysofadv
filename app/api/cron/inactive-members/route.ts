import { and, eq, isNull, lt, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/db";
import { users } from "@/db/schema";
import { monitorCronRun } from "@/lib/cron/cron-monitor";
import { captureError } from "@/lib/observability/error-monitor";
import { sendPushNotificationToAllAdmins } from "@/lib/send-push-notification";

export const runtime = "nodejs";

const INACTIVE_DAYS = 30;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await monitorCronRun({
      cronName: "inactive-members",
      handler: async () => {
        const now = new Date();
        const inactiveBefore = new Date(
          now.getTime() - INACTIVE_DAYS * 24 * 60 * 60 * 1000,
        );

        const inactiveMembers = await db
          .select({
            id: users.id,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
            nickname: users.nickname,
            lastActiveAt: users.lastActiveAt,
          })
          .from(users)
          .where(
            and(
              eq(users.role, "member"),
              eq(users.status, "approved"),
              isNull(users.inactiveDetectedAt),
              or(
                lt(users.lastActiveAt, inactiveBefore),
                and(
                  isNull(users.lastActiveAt),
                  lt(users.createdAt, inactiveBefore),
                ),
              ),
            ),
          );

        if (!inactiveMembers.length) {
          return {
            processedCount: 0,
            metadata: { inactiveDays: INACTIVE_DAYS },
            members: [],
          };
        }

        const inactiveIds = inactiveMembers.map((member) => member.id);

        await db
          .update(users)
          .set({
            inactiveDetectedAt: now,
            updatedAt: now,
          })
          .where(sql`${users.id} in ${inactiveIds}`);

        await sendPushNotificationToAllAdmins({
          title: "Inactive members detected",
          body: `${inactiveMembers.length} member${
            inactiveMembers.length > 1 ? "s" : ""
          } inactive for ${INACTIVE_DAYS}+ days.`,
          url: "/admin/members?status=approved",
        });

        const members = inactiveMembers.map((member) => ({
          id: member.id,
          name:
            member.nickname ||
            [member.firstName, member.lastName].filter(Boolean).join(" ") ||
            member.email,
          lastActiveAt: member.lastActiveAt,
        }));

        return {
          processedCount: inactiveMembers.length,
          metadata: {
            inactiveDays: INACTIVE_DAYS,
            memberIds: inactiveIds,
          },
          members,
        };
      },
    });

    return NextResponse.json({
      processed: result.members.length,
      inactiveDays: INACTIVE_DAYS,
      members: result.members,
    });
  } catch (error) {
    captureError(error, { source: "cron", cronName: "inactive-members" });

    return NextResponse.json(
      { error: "Failed to detect inactive members" },
      { status: 500 },
    );
  }
}
