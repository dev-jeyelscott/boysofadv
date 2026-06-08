"use client";

import { toggleMemberStatus } from "@/app/(protected)/admin/members/actions";
import { useTransition } from "react";

type MemberStatusActionProps = {
  memberId: string;
  status: "approved" | "suspended";
};

export function MemberStatusAction({
  memberId,
  status,
}: MemberStatusActionProps) {
  const [isPending, startTransition] = useTransition();

  const isApproved = status === "approved";

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleMemberStatus(memberId);
        });
      }}
      className={
        isApproved
          ? "rounded-lg bg-red-600 px-3 py-2 text-xs font-black uppercase text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          : "rounded-lg bg-green-600 px-3 py-2 text-xs font-black uppercase text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
      }
    >
      {isPending ? "Updating..." : isApproved ? "Suspend" : "Mark as Active"}
    </button>
  );
}
