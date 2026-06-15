"use client";

import { Check, X } from "lucide-react";

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
import {
  approveMember,
  rejectMember,
} from "@/features/members/actions/membership-approvals";

type MembershipApprovalRow = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  nickname: string | null;
  codename: string | null;
  role: string;
  status: string;
  chapter: string | null;
  unit: string | null;
  createdAt: Date | string;
};

type MembershipApprovalsTableProps = {
  members: MembershipApprovalRow[];
};

export function MembershipApprovalsTable({
  members,
}: MembershipApprovalsTableProps) {
  if (members.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-14 text-center sm:px-6">
        <p className="text-sm font-black uppercase tracking-widest text-white/60">
          No pending approvals
        </p>
        <p className="mt-2 text-sm text-white/70">
          New member registrations will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {members.map((member) => {
          const fullName =
            [member.firstName, member.lastName].filter(Boolean).join(" ") ||
            "Unnamed Member";

          return (
            <article
              key={member.id}
              className="rounded-2xl border border-white/10 bg-white/4 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-black uppercase text-white">
                    {fullName}
                  </h3>
                  <p className="mt-1 truncate text-xs uppercase tracking-widest text-white/70">
                    {member.codename || member.nickname || "No codename"}
                  </p>
                </div>

                <Badge className="shrink-0 border-yellow-500/20 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/10">
                  For Approval
                </Badge>
              </div>

              <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-black/20 p-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/70">
                    Email
                  </p>
                  <p className="mt-1 break-all text-sm text-white/70">
                    {member.email}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/70">
                      Unit
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      {member.unit || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/70">
                      Chapter
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      {member.chapter || "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <form action={approveMember.bind(null, member.id)}>
                  <Button
                    type="submit"
                    size="sm"
                    className="w-full rounded bg-red-600 text-xs font-black uppercase tracking-widest text-white hover:bg-red-700"
                  >
                    <Check className="mr-2 size-4" />
                    Approve
                  </Button>
                </form>

                <form action={rejectMember.bind(null, member.id)}>
                  <Button
                    type="submit"
                    size="sm"
                    variant="outline"
                    className="w-full rounded border-white/10 bg-transparent text-xs font-black uppercase tracking-widest text-white hover:border-red-500/50 hover:bg-white/10 hover:text-white"
                  >
                    <X className="mr-2 size-4" />
                    Reject
                  </Button>
                </form>
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-white/4 md:block">
        <div className="overflow-x-auto">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                {[
                  "Member",
                  "Email",
                  "Unit",
                  "Chapter",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <TableHead
                    key={heading}
                    className="px-5 py-4 text-center text-xs font-black uppercase tracking-widest text-white/50"
                  >
                    {heading}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {members.map((member) => {
                const fullName =
                  [member.firstName, member.lastName]
                    .filter(Boolean)
                    .join(" ") || "Unnamed Member";

                return (
                  <TableRow
                    key={member.id}
                    className="border-white/10 hover:bg-white/3"
                  >
                    <TableCell className="px-5 py-4 text-center">
                      <div>
                        <p className="font-bold text-white">{fullName}</p>
                        <p className="text-xs uppercase tracking-widest text-white/70">
                          {member.codename || member.nickname || "No codename"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-center text-white/60">
                      {member.email}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-center text-white/60">
                      {member.unit || "—"}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-center text-white/60">
                      {member.chapter || "—"}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-center">
                      <Badge className="border-yellow-500/20 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/10">
                        For Approval
                      </Badge>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <form action={approveMember.bind(null, member.id)}>
                          <Button
                            type="submit"
                            size="sm"
                            className="rounded bg-red-600 text-xs font-black uppercase tracking-widest text-white hover:bg-red-700"
                          >
                            <Check className="mr-2 size-4" />
                            Approve
                          </Button>
                        </form>

                        <form action={rejectMember.bind(null, member.id)}>
                          <Button
                            type="submit"
                            size="sm"
                            variant="outline"
                            className="rounded border-white/10 bg-transparent text-xs font-black uppercase tracking-widest text-white hover:border-red-500/50 hover:bg-white/10 hover:text-white"
                          >
                            <X className="mr-2 size-4" />
                            Reject
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
