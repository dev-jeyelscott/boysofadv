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
} from "@/app/(protected)/admin/memberships/actions";

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
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/4">
      <div className="overflow-x-auto">
        <Table className="min-w-[1100px]">
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="px-5 py-4 text-xs text-center font-black uppercase tracking-widest text-white/50">
                Member
              </TableHead>
              <TableHead className="px-5 py-4 text-xs text-center font-black uppercase tracking-widest text-white/50">
                Email
              </TableHead>
              <TableHead className="px-5 py-4 text-xs text-center font-black uppercase tracking-widest text-white/50">
                Unit
              </TableHead>
              <TableHead className="px-5 py-4 text-xs text-center font-black uppercase tracking-widest text-white/50">
                Chapter
              </TableHead>
              <TableHead className="px-5 py-4 text-xs text-center font-black uppercase tracking-widest text-white/50">
                Status
              </TableHead>
              <TableHead className="px-5 py-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {members.map((member) => {
              const fullName =
                [member.firstName, member.lastName].filter(Boolean).join(" ") ||
                "Unnamed Member";

              return (
                <TableRow
                  key={member.id}
                  className="border-white/10 hover:bg-white/3"
                >
                  <TableCell className="px-5 py-4 text-center">
                    <div>
                      <p className="font-bold text-white">{fullName}</p>
                      <p className="text-xs uppercase tracking-widest text-white/40">
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
                          className="rounded bg-red-600 text-xs  uppercase tracking-widest text-white hover:bg-red-700"
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
                          className="rounded border-white/10 bg-transparent text-xs  uppercase tracking-widest text-white hover:border-red-500/50 hover:bg-white/10 hover:text-white"
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

            {members.length === 0 && (
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableCell colSpan={6} className="px-5 py-14 text-center">
                  <p className="text-sm font-black uppercase tracking-widest text-white/60">
                    No pending approvals
                  </p>
                  <p className="mt-2 text-sm text-white/40">
                    New member registrations will appear here.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
