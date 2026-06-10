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
import { MemberActionsMenu } from "./member-action-menu";

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
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/4">
      <div className="overflow-x-auto">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow className="border-white/10 bg-white/3 hover:bg-white/3">
              <TableHead className="w-[24%] p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Name
              </TableHead>

              <TableHead className="w-[18%] p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                MC Unit
              </TableHead>

              <TableHead className="w-[18%] p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Chapter
              </TableHead>

              <TableHead className="w-[10%] p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Status
              </TableHead>

              <TableHead className="w-[10%] p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Role
              </TableHead>

              <TableHead className="w-[12%] p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Joined
              </TableHead>

              <TableHead className="w-[8%] p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {members.length > 0 ? (
              members.map((member) => (
                <TableRow
                  key={member.id}
                  className="border-white/10 transition hover:bg-white/3"
                >
                  <TableCell className="p-4 align-top text-center">
                    <div className="whitespace-normal break-words font-bold text-white">
                      {getFullName(member)}
                    </div>

                    <div className="whitespace-normal break-all text-xs text-white/60">
                      {member.email || "—"}
                    </div>

                    <div className="whitespace-normal break-words text-xs text-white/60">
                      {member.codename || "—"}
                    </div>
                  </TableCell>

                  <TableCell className="p-4 align-top text-center text-sm text-white/70">
                    <div className="whitespace-normal break-words">
                      {member.unit || "—"}
                    </div>
                  </TableCell>

                  <TableCell className="p-4 align-top text-center text-sm text-white/70">
                    <div className="whitespace-normal break-words">
                      {member.chapter || "—"}
                    </div>
                  </TableCell>

                  <TableCell className="p-4 align-top text-center">
                    <StatusBadge status={member.status} />
                  </TableCell>

                  <TableCell className="p-4 align-top text-center">
                    <RoleBadge status={member.role} />
                  </TableCell>

                  <TableCell className="p-4 align-top text-center text-sm text-white/70">
                    {formatDate(member.createdAt)}
                  </TableCell>

                  <TableCell className="p-4 align-top text-center">
                    <div className="flex items-center justify-center gap-2">
                      <MemberDetailsDialog member={member}>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="border-white/10 bg-white/3 text-white hover:bg-white/10 hover:text-white"
                          aria-label="View member details"
                        >
                          <Eye />
                        </Button>
                      </MemberDetailsDialog>

                      <MemberActionsMenu member={member} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableCell
                  colSpan={7}
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

function RoleBadge({ status }: { status: MemberRow["role"] }) {
  if (status === "admin") {
    return (
      <Badge className="border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/10">
        Admin
      </Badge>
    );
  }

  return (
    <Badge className="border-yellow-500/20 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/10">
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
