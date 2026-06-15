"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import { BuildService } from "@/src/features/builds/build-service";

export async function publishBuild(buildId: string) {
  const actor = await requireAdmin();

  await BuildService.publish({
    buildId,
    actor,
  });

  revalidatePath("/admin/builds");
  revalidatePath("/builds");
}

export async function rejectBuild(buildId: string) {
  const actor = await requireAdmin();

  await BuildService.reject({
    buildId,
    actor,
    reason: "Rejected by admin.",
  });

  revalidatePath("/admin/builds");
}
