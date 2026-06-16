import { count, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/db";
import { builds, partnerInquiries, users } from "@/db/schema";
import { monitorCronRun } from "@/lib/cron/cron-monitor";
import { captureError } from "@/lib/observability/error-monitor";
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

    const result = await monitorCronRun({
      cronName: "pending-approvals",
      handler: async () => {
        const [
          pendingMembersResult,
          pendingBuildsResult,
          pendingPartnersResult,
        ] = await Promise.all([
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
          return {
            processedCount: 0,
            metadata: {
              sent: false,
              reason: "No pending approval items",
            },
            sent: false,
            reason: "No pending approval items",
            total,
            pendingMembers,
            pendingBuilds,
            pendingPartners,
          };
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
              ? `${pendingPartners} partner inquir${
                  pendingPartners === 1 ? "y" : "ies"
                }`
              : null,
          ]
            .filter(Boolean)
            .join(" - "),
          url: "/admin",
        });

        return {
          processedCount: total,
          metadata: {
            sent: true,
            pendingMembers,
            pendingBuilds,
            pendingPartners,
          },
          sent: true,
          total,
          pendingMembers,
          pendingBuilds,
          pendingPartners,
        };
      },
    });

    return NextResponse.json({
      success: true,
      sent: result.sent,
      reason: result.reason,
      total: result.total,
      pendingMembers: result.pendingMembers,
      pendingBuilds: result.pendingBuilds,
      pendingPartners: result.pendingPartners,
    });
  } catch (error) {
    captureError(error, { source: "cron", cronName: "pending-approvals" });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send pending approval digest",
      },
      { status: 500 },
    );
  }
}
