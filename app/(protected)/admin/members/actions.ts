"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import { MemberService } from "@/src/features/members/member-service";

function revalidateMembers() {
  revalidatePath("/admin/members");
  revalidatePath("/admin/memberships");
}

export async function suspendMember(memberId: string) {
  const actor = await requireAdmin();

  await MemberService.suspend({ memberId, actor });
  revalidateMembers();
}

export async function markMemberAsActive(memberId: string) {
  const actor = await requireAdmin();

  await MemberService.markActive({ memberId, actor });
  revalidateMembers();
}

export async function promoteMemberToAdmin(memberId: string) {
  const actor = await requireAdmin();

  await MemberService.promoteToAdmin({ memberId, actor });
  revalidateMembers();
}

export async function demoteMemberToMember(memberId: string) {
  const actor = await requireAdmin();

  await MemberService.demoteToMember({ memberId, actor });
  revalidateMembers();
}

export async function archiveMember(memberId: string) {
  const actor = await requireAdmin();

  await MemberService.archive({ memberId, actor });
  revalidateMembers();
}
