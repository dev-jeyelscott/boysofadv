"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { deleteEventAction } from "@/app/(protected)/admin/events/actions";
import { EventRow } from "@/lib/constants/event";
import EventEditDialog from "./event-edit-dialog";

type Props = {
  event: EventRow;
};

export function EventActionsMenu({ event }: Props) {
  const [isPending, startTransition] = useTransition();

  function onDelete() {
    if (!confirm("Delete this event?")) return;

    startTransition(async () => {
      await deleteEventAction(event.id);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="border-white/10 bg-white/3 text-white hover:bg-white/10 hover:text-white"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 border-white/10 bg-neutral-950 p-1 text-white"
      >
        <EventEditDialog event={event} />

        <button
          type="button"
          disabled={isPending}
          onClick={onDelete}
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-bold text-red-400 hover:bg-red-500/10"
        >
          <Trash2 className="size-4" />
          Delete
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
