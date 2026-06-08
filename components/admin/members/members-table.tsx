"use client";

import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
        <table className="w-full min-w-[1000px] text-left">
          <thead className="border-b border-white/10 bg-white/[0.03]">
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Nickname</Th>
              <Th>Codename</Th>
              <Th>MC Unit</Th>
              <Th>Chapter</Th>
              <Th>Status</Th>
              <Th>Joined</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>

          <tbody>
            {members.length > 0 ? (
              members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-white/10 transition hover:bg-white/[0.03]"
                >
                  <Td>
                    <div className="font-bold text-white">
                      {getFullName(member)}
                    </div>
                  </Td>

                  <Td>{member.email}</Td>
                  <Td>{member.nickname || "—"}</Td>
                  <Td>{member.codename || "—"}</Td>
                  <Td>{member.unit || "—"}</Td>
                  <Td>{member.chapter || "—"}</Td>

                  <Td>
                    <StatusBadge status={member.status} />
                  </Td>

                  <Td>{formatDate(member.createdAt)}</Td>

                  <Td>
                    <div className="flex items-center justify-end gap-2">
                      <MemberDetailsDialog member={member}>
                        <button
                          type="button"
                          className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 text-white/70 transition hover:bg-white/10 hover:text-white"
                          aria-label="View member details"
                        >
                          <Eye className="size-4" />
                        </button>
                      </MemberDetailsDialog>

                      <MemberStatusAction
                        memberId={member.id}
                        status={member.status}
                      />
                    </div>
                  </Td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-12 text-center text-sm text-white/50"
                >
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-4 text-xs font-black uppercase tracking-widest text-white/50 ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-4 text-sm text-white/70">{children}</td>;
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
