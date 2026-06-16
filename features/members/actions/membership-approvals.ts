"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import { MemberService } from "@/src/features/members/member-service";
import { revalidateMemberCaches } from "@/src/lib/cache/revalidate";

export async function approveMember(userId: string) {
  const actor = await requireAdmin();

  await MemberService.approve({
    memberId: userId,
    actor,
  });

  revalidatePath("/admin/members");
  revalidatePath("/admin/memberships");
  revalidateMemberCaches();
}

export async function rejectMember(userId: string) {
  const actor = await requireAdmin();

  await MemberService.reject({
    memberId: userId,
    actor,
  });

  revalidatePath("/admin/members");
  revalidatePath("/admin/memberships");
  revalidateMemberCaches();
}
