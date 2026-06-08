"use client";

import { toggleMemberStatus } from "@/app/(protected)/admin/members/actions";
import { Button } from "@/components/ui/button";
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
    <Button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleMemberStatus(memberId);
        });
      }}
      className={
        isApproved
          ? "inline-flex items-center gap-2 rounded-lg bg-red-600 text-xs font-black uppercase text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          : "inline-flex items-center gap-2 rounded-lg bg-green-600 text-xs font-black uppercase text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
      }
    >
      {isPending ? "Updating..." : isApproved ? "Suspend" : "Mark as Active"}
    </Button>
  );
}
