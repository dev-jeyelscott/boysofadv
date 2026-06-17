"use server";

import { revalidatePath } from "next/cache";

import { type BuildStatus } from "@/lib/constants/build";
import { requireAdmin } from "@/lib/auth/require-admin";
import { BuildService } from "@/src/features/builds/build-service";
import { revalidateBuildCaches } from "@/src/lib/cache/revalidate";
import { getAdminBuilds } from "./queries";

export async function publishBuild(buildId: string) {
  const actor = await requireAdmin();

  await BuildService.publish({
    buildId,
    actor,
  });

  revalidatePath("/admin/builds");
  revalidatePath("/builds");
  revalidateBuildCaches();
}

export async function rejectBuild(buildId: string) {
  const actor = await requireAdmin();

  await BuildService.reject({
    buildId,
    actor,
    reason: "Rejected by admin.",
  });

  revalidatePath("/admin/builds");
  revalidateBuildCaches();
}

export async function loadMoreAdminBuilds(input: {
  cursor: string;
  search?: string;
  model?: string;
  concept?: string;
  status?: BuildStatus;
  isFeatured?: string;
}) {
  await requireAdmin();

  return getAdminBuilds(input);
}
