"use client";

import { Edit, Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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
import { PartnerRow } from "@/lib/constants/partner";
import { EditPartnerDialog } from "./edit-partner-dialog";
import { ViewPartnerDetailsDialog } from "./view-partner-details-dialog";

type Props = {
  partners: PartnerRow[];
};

export function PartnersTable({ partners }: Props) {
  const [editingPartner, setEditingPartner] = useState<PartnerRow | null>(null);
  const [viewingPartner, setViewingPartner] = useState<PartnerRow | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/4">
        <div className="overflow-x-auto">
          <Table className="min-w-225">
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                  Partner
                </TableHead>
                <TableHead className="p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                  Category
                </TableHead>
                <TableHead className="p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                  Website
                </TableHead>
                <TableHead className="p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                  Status
                </TableHead>
                <TableHead className="p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                  Created
                </TableHead>
                <TableHead className="p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {partners.length === 0 ? (
                <TableRow className="border-white/10 text-sm text-white/80 hover:bg-white/3">
                  <TableCell colSpan={6} className="p-4 text-center">
                    No partners found.
                  </TableCell>
                </TableRow>
              ) : (
                partners.map((partner) => (
                  <TableRow
                    key={partner.id}
                    className="border-white/10 text-sm text-white/80 hover:bg-white/3"
                  >
                    <TableCell className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black">
                          {partner.logoUrl ? (
                            <Image
                              src={partner.logoUrl}
                              alt={partner.name}
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-[10px] text-white/30">
                              N/A
                            </div>
                          )}
                        </div>

                        <span className="font-black text-white">
                          {partner.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="p-4 text-center">
                      {partner.category ?? "—"}
                    </TableCell>

                    <TableCell className="p-4 text-center">
                      {partner.websiteUrl ? (
                        <a
                          href={partner.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-red-400"
                        >
                          Visit Website
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell className="p-4 text-center">
                      <StatusBadge status={partner.status} />
                    </TableCell>

                    <TableCell className="p-4 text-center">
                      {formatDate(partner.createdAt)}
                    </TableCell>

                    <TableCell className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => setViewingPartner(partner)}
                          className="h-9 w-9 text-white/60 hover:bg-white/10 hover:text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditingPartner(partner)}
                          className="h-9 w-9 text-white/60 hover:bg-white/10 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <EditPartnerDialog
        partner={editingPartner}
        onClose={() => setEditingPartner(null)}
      />

      <ViewPartnerDetailsDialog
        partner={viewingPartner}
        onClose={() => setViewingPartner(null)}
      />
    </>
  );
}

function StatusBadge({ status }: { status: PartnerRow["status"] }) {
  if (status === "active") {
    return (
      <Badge className="border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/10">
        Active
      </Badge>
    );
  }

  if (status === "inactive") {
    return (
      <Badge className="border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/10">
        Inactive
      </Badge>
    );
  }

  return (
    <Badge className="border-yellow-500/20 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/10">
      Draft
    </Badge>
  );
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}
