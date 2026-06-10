"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { EventFormFields } from "./event-form-fields";
import { createEventAction } from "@/app/(protected)/admin/events/actions";
import { useState, useTransition } from "react";

export function EventCreateDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await createEventAction(formData);

      if (result.success) {
        setOpen(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-white/40 bg-black text-white hover:bg-white/10 hover:text-white"
        >
          <Plus className="size-4" />
          Add Event
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-neutral-950 text-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase">
            Create Event
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <EventFormFields />

          <div className="flex justify-end pt-2">
            <Button
              disabled={isPending}
              type="submit"
              className="bg-red-600 font-black uppercase text-white hover:bg-red-500"
            >
              {isPending ? "Saving..." : "Save Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
