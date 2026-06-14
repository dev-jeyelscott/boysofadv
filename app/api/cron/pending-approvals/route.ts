import { NextResponse } from "next/server";
import { count, eq, inArray } from "drizzle-orm";

import { builds, partnerInquiries, users } from "@/db/schema";
import { db } from "@/db/db";
import { sendPushNotificationToAllAdmins } from "@/lib/send-push-notification";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) return false;

  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [pendingMembersResult, pendingBuildsResult, pendingPartnersResult] =
      await Promise.all([
        db
          .select({ value: count() })
          .from(users)
          .where(eq(users.status, "for_approval")),

        db
          .select({ value: count() })
          .from(builds)
          .where(inArray(builds.status, ["for_review"])),

        db
          .select({ value: count() })
          .from(partnerInquiries)
          .where(eq(partnerInquiries.status, "new")),
      ]);

    const pendingMembers = pendingMembersResult[0]?.value ?? 0;
    const pendingBuilds = pendingBuildsResult[0]?.value ?? 0;
    const pendingPartners = pendingPartnersResult[0]?.value ?? 0;

    const total = pendingMembers + pendingBuilds + pendingPartners;

    if (total === 0) {
      return NextResponse.json({
        success: true,
        sent: false,
        reason: "No pending approval items",
      });
    }

    await sendPushNotificationToAllAdmins({
      title: "Pending approvals need review",
      body: [
        `${total} item${total === 1 ? "" : "s"} waiting for admin action.`,
        pendingMembers
          ? `${pendingMembers} member${pendingMembers === 1 ? "" : "s"}`
          : null,
        pendingBuilds
          ? `${pendingBuilds} build${pendingBuilds === 1 ? "" : "s"}`
          : null,
        pendingPartners
          ? `${pendingPartners} partner inquir${pendingPartners === 1 ? "y" : "ies"}`
          : null,
      ]
        .filter(Boolean)
        .join(" · "),
      url: "/admin",
    });

    return NextResponse.json({
      success: true,
      sent: true,
      total,
      pendingMembers,
      pendingBuilds,
      pendingPartners,
    });
  } catch (error) {
    console.error("[PENDING_APPROVAL_DIGEST_CRON_ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send pending approval digest",
      },
      { status: 500 },
    );
  }
}
