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

import { MemberDetailsDialog } from "./member-details-dialog";
import { MemberStatusAction } from "./member-status-action";

export type MemberRow = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  nickname: string | null;
  codename: string | null;
  unit: string | null;
  chapter: string | null;
  status: "approved" | "suspended";
  createdAt: Date | string;
};

type MembersTableProps = {
  members: MemberRow[];
};

export function MembersTable({ members }: MembersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
      <div className="overflow-x-auto">
        <Table className="min-w-[1100px]">
          <TableHeader>
            <TableRow className="border-white/10 bg-white/[0.03] hover:bg-white/[0.03]">
              <TableHead className="p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Name
              </TableHead>
              <TableHead className="p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Email
              </TableHead>
              <TableHead className="p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Nickname
              </TableHead>
              <TableHead className="p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Codename
              </TableHead>
              <TableHead className="p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                MC Unit
              </TableHead>
              <TableHead className="p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Chapter
              </TableHead>
              <TableHead className="p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Status
              </TableHead>
              <TableHead className="p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Joined
              </TableHead>
              <TableHead className="p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {members.length > 0 ? (
              members.map((member) => (
                <TableRow
                  key={member.id}
                  className="border-white/10 transition hover:bg-white/[0.03]"
                >
                  <TableCell className="p-4 text-center">
                    <div className="font-bold text-white">
                      {getFullName(member)}
                    </div>
                  </TableCell>

                  <TableCell className="p-4 text-center text-sm text-white/70">
                    {member.email}
                  </TableCell>

                  <TableCell className="p-4 text-center text-sm text-white/70">
                    {member.nickname || "—"}
                  </TableCell>

                  <TableCell className="p-4 text-center text-sm text-white/70">
                    {member.codename || "—"}
                  </TableCell>

                  <TableCell className="p-4 text-center text-sm text-white/70">
                    {member.unit || "—"}
                  </TableCell>

                  <TableCell className="p-4 text-center text-sm text-white/70">
                    {member.chapter || "—"}
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    <StatusBadge status={member.status} />
                  </TableCell>

                  <TableCell className="p-4 text-center text-sm text-white/70">
                    {formatDate(member.createdAt)}
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <MemberDetailsDialog member={member}>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className=" border-white/10 bg-white/[0.03] text-white hover:bg-white/10 hover:text-white"
                          aria-label="View member details"
                        >
                          <Eye />
                        </Button>
                      </MemberDetailsDialog>

                      <MemberStatusAction
                        memberId={member.id}
                        status={member.status}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableCell
                  colSpan={9}
                  className="px-4 py-12 text-center text-sm text-white/50"
                >
                  No members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
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

  return (
    <Badge className="border-yellow-500/20 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/10">
      Suspended
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
