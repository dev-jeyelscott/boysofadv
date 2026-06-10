"use client";

import { Edit, Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
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
      <div className="space-y-3 md:hidden">
        {partners.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/4 p-5 text-center text-sm text-white/60">
            No partners found.
          </div>
        ) : (
          partners.map((partner) => (
            <article
              key={partner.id}
              className="rounded-2xl border border-white/10 bg-white/4 p-4"
            >
              <div className="flex gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black">
                  {partner.logoUrl ? (
                    <Image
                      src={partner.logoUrl}
                      alt={partner.name}
                      fill
                      className="object-contain p-1"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-[10px] text-white/30">
                      N/A
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-black uppercase text-white">
                    {partner.name}
                  </h3>

                  <div className="mt-1">
                    <StatusBadge status={partner.status} />
                  </div>

                  <div className="mt-3 space-y-2 text-xs text-white/50">
                    <div className="flex justify-between gap-3">
                      <span className="uppercase tracking-widest">
                        Category
                      </span>
                      <span className="text-right text-white/80">
                        {partner.category ?? "—"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="uppercase tracking-widest">Created</span>
                      <span className="text-right text-white/80">
                        {formatDate(partner.createdAt)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="uppercase tracking-widest">Website</span>
                      {partner.websiteUrl ? (
                        <a
                          href={partner.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-right font-bold text-red-400"
                        >
                          Visit Website
                        </a>
                      ) : (
                        <span className="text-white/80">—</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setViewingPartner(partner)}
                  className="rounded-full bg-white/10 text-white hover:bg-white/15"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>

                <Button
                  type="button"
                  onClick={() => setEditingPartner(partner)}
                  className="rounded-full bg-red-600 font-black uppercase text-white hover:bg-red-500"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-white/4 md:block">
        <div className="overflow-x-auto">
          <Table className="min-w-225">
            {/* keep your existing table code here */}
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
