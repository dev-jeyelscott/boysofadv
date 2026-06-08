"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

type Props = {
  status: string;
  onPublish: () => void;
  onReject: () => void;
  disabled?: boolean;
};

export function BuildStatusAction({
  status,
  onPublish,
  onReject,
  disabled,
}: Props) {
  if (status !== "for_review") {
    return null;
  }

  return (
    <>
      <Button
        disabled={disabled}
        onClick={onPublish}
        className="inline-flex items-center gap-2 rounded-lg bg-green-600 text-xs font-black uppercase text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <CheckCircle2 />
        Publish
      </Button>

      <Button
        disabled={disabled}
        onClick={onReject}
        className="inline-flex items-center gap-2 rounded-lg bg-red-600 text-xs font-black uppercase text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <XCircle />
        Reject
      </Button>
    </>
  );
}
