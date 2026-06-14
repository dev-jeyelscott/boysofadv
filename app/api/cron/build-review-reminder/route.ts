import { NextResponse } from "next/server";

import { builds, users } from "@/db/schema";
import { and, eq, inArray, lte } from "drizzle-orm";
import { db } from "@/db/db";
import { sendPushNotificationToUser } from "@/lib/send-push-notification";

export const runtime = "nodejs";

const REVIEW_STALE_HOURS = 24;

function getCronSecret(request: Request) {
  return request.headers.get("authorization")?.replace("Bearer ", "");
}

export async function GET(request: Request) {
  try {
    const secret = getCronSecret(request);

    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const staleDate = new Date();
    staleDate.setHours(staleDate.getHours() - REVIEW_STALE_HOURS);

    const pendingBuilds = await db
      .select({
        id: builds.id,
        title: builds.title,
        ownerId: builds.userId,
        submittedAt: builds.updatedAt,
      })
      .from(builds)
      .where(
        and(eq(builds.status, "for_review"), lte(builds.updatedAt, staleDate)),
      );

    if (pendingBuilds.length === 0) {
      return NextResponse.json({
        ok: true,
        message: "No pending build reviews found.",
        notifiedAdmins: 0,
        pendingBuilds: 0,
      });
    }

    const admins = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(
        and(
          inArray(users.role, ["admin", "super_admin"]),
          eq(users.status, "approved"),
        ),
      );

    if (admins.length === 0) {
      return NextResponse.json({
        ok: true,
        message: "Pending builds found, but no approved admins exist.",
        notifiedAdmins: 0,
        pendingBuilds: pendingBuilds.length,
      });
    }

    const buildCount = pendingBuilds.length;

    await Promise.allSettled(
      admins.map((admin) =>
        sendPushNotificationToUser(admin.id, {
          title: "Build Review Reminder",
          body:
            buildCount === 1
              ? "1 build is waiting for admin review."
              : `${buildCount} builds are waiting for admin review.`,
          url: "/admin/builds?status=for_review",
        }),
      ),
    );

    return NextResponse.json({
      ok: true,
      message: "Build review reminder sent.",
      notifiedAdmins: admins.length,
      pendingBuilds: buildCount,
    });
  } catch (error) {
    console.error("[BUILD_REVIEW_REMINDER_CRON]", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to run build review reminder.",
      },
      { status: 500 },
    );
  }
}
