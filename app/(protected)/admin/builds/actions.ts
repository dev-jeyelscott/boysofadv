"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { builds } from "@/db/schema";
import { BUILD_STATUSES } from "@/lib/constants/build";
import { sendPushNotificationToUser } from "@/lib/send-push-notification";

export async function publishBuild(buildId: string, userId: string) {
  const build = await db.query.builds.findFirst({
    where: eq(builds.id, buildId),
  });

  if (!build) {
    throw new Error("Build not found.");
  }

  if (build.status !== BUILD_STATUSES.FOR_REVIEW) {
    throw new Error("Only builds for approval can be published.");
  }

  await db
    .update(builds)
    .set({
      status: BUILD_STATUSES.PUBLISHED,
      updatedAt: new Date(),
    })
    .where(eq(builds.id, buildId));

  await sendPushNotificationToUser(userId, {
    title: "Build Published",
    body: `Your build has been published.`,
    url: `/builds/${buildId}`,
  });

  revalidatePath("/admin/builds");
}

export async function rejectBuild(buildId: string, userId: string) {
  const build = await db.query.builds.findFirst({
    where: eq(builds.id, buildId),
  });

  if (!build) {
    throw new Error("Build not found.");
  }

  if (build.status !== BUILD_STATUSES.FOR_REVIEW) {
    throw new Error("Only builds for approval can be rejected.");
  }

  await db
    .update(builds)
    .set({
      status: BUILD_STATUSES.REJECTED,
      updatedAt: new Date(),
    })
    .where(eq(builds.id, buildId));

  await sendPushNotificationToUser(userId, {
    title: "Build Rejected",
    body: `Your build is not approved to publish. Please check the contents of your build and resubmit application.`,
    url: "/my-build",
  });

  revalidatePath("/admin/builds");
}
