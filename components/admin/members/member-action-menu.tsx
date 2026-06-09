"use client";

import { MoreHorizontal } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { MemberRow } from "./members-table";
import {
  archiveMember,
  demoteMemberToMember,
  promoteMemberToAdmin,
  suspendMember,
  markMemberAsActive,
} from "@/app/(protected)/admin/members/actions";

type Props = {
  member: MemberRow;
};

export function MemberActionsMenu({ member }: Props) {
  console.log(member);
  const [isPending, startTransition] = useTransition();

  function runAction(action: () => Promise<void>) {
    startTransition(async () => {
      await action();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="outline"
          disabled={isPending}
          className="border-white/10 bg-white/3 text-white hover:bg-white/10 hover:text-white"
          aria-label="Open member actions"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-52 border-white/10 bg-zinc-950 text-white"
      >
        <DropdownMenuItem
          disabled={member.status === "suspended" || isPending}
          onClick={() => runAction(() => suspendMember(member.id))}
          className="cursor-pointer focus:bg-white/10 focus:text-white"
        >
          Suspend
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={member.status === "approved" || isPending}
          onClick={() => runAction(() => markMemberAsActive(member.id))}
          className="cursor-pointer focus:bg-white/10 focus:text-white"
        >
          Mark as Active
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem
          disabled={member.role === "admin" || isPending}
          onClick={() => runAction(() => promoteMemberToAdmin(member.id))}
          className="cursor-pointer focus:bg-white/10 focus:text-white"
        >
          Promote to Admin
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={member.role === "member" || isPending}
          onClick={() => runAction(() => demoteMemberToMember(member.id))}
          className="cursor-pointer focus:bg-white/10 focus:text-white"
        >
          Demote to Member
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem
          disabled={isPending}
          onClick={() => runAction(() => archiveMember(member.id))}
          className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-300"
        >
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
