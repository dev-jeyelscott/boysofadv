"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import { PartnershipService } from "@/src/features/partnerships/services/partnership-service";

export async function markPartnerInquiryAsContacted(id: string) {
  const actor = await requireAdmin();

  await PartnershipService.markPartnerInquiryAsContacted(id, actor);

  revalidatePath("/admin/partnership");
}

export async function approvePartnerInquiry(id: string) {
  const actor = await requireAdmin();

  await PartnershipService.approvePartnerInquiry(id, actor);

  revalidatePath("/admin/partnership");
  revalidatePath("/admin/partners");
  revalidatePath("/partners");
}

export async function rejectPartnerInquiry(id: string) {
  const actor = await requireAdmin();

  await PartnershipService.rejectPartnerInquiry(id, actor);

  revalidatePath("/admin/partnership");
}
