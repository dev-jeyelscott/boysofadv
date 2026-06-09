"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PartnerRow } from "@/lib/constants/partner";

type Props = {
  partner: PartnerRow | null;
  onClose: () => void;
};

export function ViewPartnerDetailsDialog({ partner, onClose }: Props) {
  if (!partner) return null;

  return (
    <Dialog open={!!partner} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-zinc-950 text-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase">
            Partner Details
          </DialogTitle>

          <DialogDescription className="text-white/50">
            View partner brand, logo, links, and status information.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
            <div className="flex gap-5 md:items-center">
              <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black">
                {partner.logoUrl ? (
                  <Image
                    src={partner.logoUrl}
                    alt={partner.name}
                    fill
                    className="object-contain p-3"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-xs font-black uppercase text-white/30">
                    No Logo
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-2xl font-black uppercase text-white">
                  {partner.name}
                </h3>

                <p className="mt-2 text-sm text-white/50">
                  {partner.category || "No category"}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <PartnerStatusBadge status={partner.status} />

                  {partner.isOfficial ? (
                    <Badge className="rounded-full bg-red-600 px-3 py-1 text-xs font-black uppercase text-white hover:bg-red-600">
                      Official
                    </Badge>
                  ) : (
                    <Badge className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase text-white/50 hover:bg-white/10">
                      Not Official
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-2 rounded-2xl border border-white/10 bg-black/40 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-white/50">
              Description
            </p>

            <p className="whitespace-pre-line text-sm leading-6 text-white/70">
              {partner.description || "No description provided."}
            </p>
          </div>

          <InfoGrid>
            <InfoItem label="Website URL" value={partner.websiteUrl} isLink />
            <InfoItem label="Facebook URL" value={partner.facebookUrl} isLink />
          </InfoGrid>

          <InfoGrid>
            <InfoItem label="Created At" value={partner.createdAt} />
            <InfoItem label="Updated At" value={partner.updatedAt} />
          </InfoGrid>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/20 bg-black text-white hover:bg-white/10 hover:text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 md:grid-cols-2">{children}</div>;
}

function InfoItem({
  label,
  value,
  isLink = false,
}: {
  label: string;
  value?: string | Date | null;
  isLink?: boolean;
}) {
  const displayValue =
    value instanceof Date ? formatDate(value) : value ? String(value) : "—";

  return (
    <div className="grid gap-2 rounded-2xl border border-white/10 bg-black/40 p-4">
      <p className="text-xs font-black uppercase tracking-widest text-white/50">
        {label}
      </p>

      {isLink && value ? (
        <a
          href={String(value)}
          target="_blank"
          rel="noreferrer"
          className="flex min-w-0 items-center gap-2 text-sm text-red-400 hover:text-red-300"
        >
          <span className="truncate">{String(value)}</span>
          <ExternalLink className="size-4 shrink-0" />
        </a>
      ) : (
        <p className="break-words text-sm text-white/70">{displayValue}</p>
      )}
    </div>
  );
}

function PartnerStatusBadge({ status }: { status: PartnerRow["status"] }) {
  const label =
    status === "draft" ? "Draft" : status === "active" ? "Active" : "Inactive";

  return (
    <Badge className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase text-white/60 hover:bg-white/10">
      {label}
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
