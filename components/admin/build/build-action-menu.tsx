// components/admin/builds/build-action-menu.tsx
"use client";

import { Eye, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type BuildActionMenuProps = {
  status: string;
  onView: () => void;
  onPublish: () => void;
  onReject: () => void;
};

export function BuildActionMenu({
  status,
  onView,
  onPublish,
  onReject,
}: BuildActionMenuProps) {
  const canPublish = status === "for_review";
  const canReject = status === "for_review";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label="Open build actions"
          className="border-white/10 bg-white/3 text-white hover:bg-white/10 hover:text-white"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="border-white/10 bg-zinc-950 text-white"
      >
        <DropdownMenuItem
          onClick={onView}
          className="cursor-pointer gap-2 focus:bg-white/10 focus:text-white"
        >
          <Eye className="size-4" />
          View Details
        </DropdownMenuItem>

        {canPublish && (
          <DropdownMenuItem
            onClick={onPublish}
            className="cursor-pointer text-emerald-400 focus:bg-emerald-500/10 focus:text-emerald-300"
          >
            Publish
          </DropdownMenuItem>
        )}

        {canReject && (
          <DropdownMenuItem
            onClick={onReject}
            className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-300"
          >
            Reject
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
