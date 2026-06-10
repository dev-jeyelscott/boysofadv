"use client";

import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { EventFormFields } from "./event-form-fields";
import { updateEventAction } from "@/app/(protected)/admin/events/actions";
import { EventRow } from "@/lib/constants/event";
import { useState, useTransition } from "react";

type Props = {
  event: EventRow;
};

export default function EventEditDialog({ event }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await updateEventAction(formData);

      if (result.success) {
        setOpen(false);
      }
    });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-bold text-white hover:bg-white/10">
          <Pencil className="size-4" />
          Edit
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-neutral-950 text-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase">
            Edit Event
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <EventFormFields event={event} />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-red-600 font-black uppercase text-white hover:bg-red-500"
          >
            {isPending ? "Updating..." : "Update Event"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
