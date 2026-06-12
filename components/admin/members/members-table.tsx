"use client";

import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { MemberActionsMenu } from "./member-action-menu";
import { MemberDetailsDialog } from "./member-details-dialog";

export type MemberRow = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: string;
  bio: string | null;
  nickname: string | null;
  codename: string | null;
  unit: string | null;
  chapter: string | null;
  status: "approved" | "suspended" | "archived";
  createdAt: Date | string;
};

type MembersTableProps = {
  members: MemberRow[];
};

export function MembersTable({ members }: MembersTableProps) {
  if (members.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-12 text-center text-sm text-white/50 sm:px-6">
        No members found.
      </div>
    );
  }

  return (
    <>
      {/* Mobile-first cards */}
      <div className="grid gap-3 lg:hidden">
        {members.map((member) => (
          <article
            key={member.id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/4"
          >
            <div className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="wrap-break-word text-sm font-black uppercase leading-5 text-white sm:text-base">
                    {getFullName(member)}
                  </h3>

                  <StatusBadge status={member.status} />
                </div>

                <p className="mt-1 break-all text-xs text-white/60">
                  {member.email}
                </p>

                <p className="mt-1 wrap-break-word text-xs text-white/70">
                  {member.codename || member.nickname || "No codename"}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <MemberDetailsDialog member={member}>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="size-9 border-white/10 bg-white/3 text-white hover:bg-white/10 hover:text-white"
                    aria-label="View member details"
                  >
                    <Eye className="size-4" />
                  </Button>
                </MemberDetailsDialog>

                <MemberActionsMenu member={member} />
              </div>
            </div>

            <div className="grid gap-2 border-t border-white/10 bg-black/20 p-4 text-sm">
              <InfoRow label="MC Unit" value={member.unit || "—"} />
              <InfoRow label="Chapter" value={member.chapter || "—"} />
              <InfoRow label="Joined" value={formatDate(member.createdAt)} />

              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-black uppercase tracking-widest text-white/70">
                  Role
                </span>
                <RoleBadge role={member.role} />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-white/4 lg:block">
        <div className="overflow-x-auto">
          <Table className="min-w-[980px]">
            <TableHeader>
              <TableRow className="border-white/10 bg-white/3 hover:bg-white/3">
                <TableHead className="p-4 text-xs font-black uppercase tracking-widest text-white/50">
                  Member
                </TableHead>
                <TableHead className="p-4 text-xs font-black uppercase tracking-widest text-white/50">
                  MC Unit
                </TableHead>
                <TableHead className="p-4 text-xs font-black uppercase tracking-widest text-white/50">
                  Chapter
                </TableHead>
                <TableHead className="p-4 text-xs font-black uppercase tracking-widest text-white/50">
                  Status
                </TableHead>
                <TableHead className="p-4 text-xs font-black uppercase tracking-widest text-white/50">
                  Role
                </TableHead>
                <TableHead className="p-4 text-xs font-black uppercase tracking-widest text-white/50">
                  Joined
                </TableHead>
                <TableHead className="p-4 text-right text-xs font-black uppercase tracking-widest text-white/50">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {members.map((member) => (
                <TableRow
                  key={member.id}
                  className="border-white/10 transition hover:bg-white/3"
                >
                  <TableCell className="p-4 align-top">
                    <div className="max-w-[260px]">
                      <div className="wrap-break-word font-bold text-white">
                        {getFullName(member)}
                      </div>

                      <div className="break-all text-xs text-white/60">
                        {member.email}
                      </div>

                      <div className="wrap-break-word text-xs text-white/70">
                        {member.codename || member.nickname || "—"}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="p-4 align-top text-sm text-white/70">
                    <div className="max-w-[180px] wrap-break-word">
                      {member.unit || "—"}
                    </div>
                  </TableCell>

                  <TableCell className="p-4 align-top text-sm text-white/70">
                    <div className="max-w-[180px] wrap-break-word">
                      {member.chapter || "—"}
                    </div>
                  </TableCell>

                  <TableCell className="p-4 align-top">
                    <StatusBadge status={member.status} />
                  </TableCell>

                  <TableCell className="p-4 align-top">
                    <RoleBadge role={member.role} />
                  </TableCell>

                  <TableCell className="p-4 align-top text-sm text-white/70">
                    {formatDate(member.createdAt)}
                  </TableCell>

                  <TableCell className="p-4 align-top">
                    <div className="flex items-center justify-end gap-2">
                      <MemberDetailsDialog member={member}>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="size-9 border-white/10 bg-white/3 text-white hover:bg-white/10 hover:text-white"
                          aria-label="View member details"
                        >
                          <Eye className="size-4" />
                        </Button>
                      </MemberDetailsDialog>

                      <MemberActionsMenu member={member} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="shrink-0 text-xs font-black uppercase tracking-widest text-white/70">
        {label}
      </span>

      <span className="min-w-0 wrap-break-word text-right text-sm text-white/70">
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: MemberRow["status"] }) {
  if (status === "approved") {
    return (
      <Badge className="border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/10">
        Active
      </Badge>
    );
  }

  if (status === "archived") {
    return (
      <Badge className="border-white/10 bg-white/4 text-white/50 hover:bg-white/4">
        Archived
      </Badge>
    );
  }

  return (
    <Badge className="border-yellow-500/20 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/10">
      Suspended
    </Badge>
  );
}

function RoleBadge({ role }: { role: MemberRow["role"] }) {
  if (role === "admin") {
    return (
      <Badge className="border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/10">
        Admin
      </Badge>
    );
  }

  return (
    <Badge className="border-white/10 bg-white/4 text-white/60 hover:bg-white/4">
      Member
    </Badge>
  );
}

function getFullName(member: MemberRow) {
  const fullName = [member.firstName, member.lastName]
    .filter(Boolean)
    .join(" ");

  return fullName || member.nickname || member.codename || member.email;
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
