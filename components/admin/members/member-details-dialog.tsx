"use client";

import { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { MemberRow } from "@/components/admin/members/members-table";

type MemberDetailsDialogProps = {
  member: MemberRow;
  children: ReactNode;
};

export function MemberDetailsDialog({
  member,
  children,
}: MemberDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="border-white/10 bg-neutral-950 text-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase">
            Member Details
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Detail label="Name" value={getFullName(member)} />
          <Detail label="Email" value={member.email} />
          <Detail label="Nickname" value={member.nickname} />
          <Detail label="Codename" value={member.codename} />
          <Detail label="Motorcycle Unit" value={member.unit} />
          <Detail label="Chapter" value={member.chapter} />
          <Detail
            label="Status"
            value={member.status === "approved" ? "Active" : "Suspended"}
          />
          <Detail label="Joined" value={formatDate(member.createdAt)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs font-black uppercase tracking-widest text-white/40">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-white">{value || "—"}</p>
    </div>
  );
}

function getFullName(member: MemberRow) {
  return [member.firstName, member.lastName].filter(Boolean).join(" ") || "—";
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
