"use client";

import { Eye, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  approvePartnerInquiry,
  markPartnerInquiryAsContacted,
  rejectPartnerInquiry,
} from "@/app/(protected)/admin/partnership/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PartnerInquiryStatus } from "@/src/features/partnerships/partnership-validation";

type PartnerInquiryRow = {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phoneNumber: string;
  websiteUrl: string | null;
  facebookUrl: string | null;
  message: string;
  status: PartnerInquiryStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
};

type PartnershipInquiriesTableProps = {
  inquiries: PartnerInquiryRow[];
};

export function PartnershipInquiriesTable({
  inquiries,
}: PartnershipInquiriesTableProps) {
  const [viewingInquiry, setViewingInquiry] =
    useState<PartnerInquiryRow | null>(null);

  if (inquiries.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-12 text-center text-sm text-white/50 sm:px-6">
        No partnership inquiries found.
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-3 lg:hidden">
        {inquiries.map((inquiry) => (
          <article
            key={inquiry.id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/4"
          >
            <div className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="wrap-break-word text-sm font-black uppercase leading-5 text-white sm:text-base">
                    {inquiry.businessName}
                  </h3>
                  <StatusBadge status={inquiry.status} />
                </div>

                <p className="mt-1 break-all text-xs text-white/60">
                  {inquiry.email}
                </p>
                <p className="mt-1 wrap-break-word text-xs text-white/70">
                  {inquiry.phoneNumber}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => setViewingInquiry(inquiry)}
                  className="size-9 border-white/10 bg-white/3 text-white hover:bg-white/10 hover:text-white"
                  aria-label="View partnership inquiry details"
                >
                  <Eye className="size-4" />
                </Button>

                <PartnershipInquiryActionsMenu
                  inquiry={inquiry}
                  onView={() => setViewingInquiry(inquiry)}
                />
              </div>
            </div>

            <div className="grid gap-2 border-t border-white/10 bg-black/20 p-4 text-sm">
              <InfoRow label="Contact" value={inquiry.contactName} />
              <InfoRow
                label="Inquiry Date"
                value={formatDate(inquiry.createdAt)}
              />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-white/4 lg:block">
        <div className="overflow-x-auto">
          <Table className="min-w-[980px]">
            <TableHeader>
              <TableRow className="border-white/10 bg-white/3 hover:bg-white/3">
                {[
                  "Business Name",
                  "Email",
                  "Phone Number",
                  "Status",
                  "Date of Inquiry",
                  "Actions",
                ].map((heading) => (
                  <TableHead
                    key={heading}
                    className="p-4 text-xs font-black uppercase tracking-widest text-white/50"
                  >
                    {heading}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow
                  key={inquiry.id}
                  className="border-white/10 transition hover:bg-white/3"
                >
                  <TableCell className="p-4 align-top">
                    <div className="max-w-[260px] wrap-break-word font-bold text-white">
                      {inquiry.businessName}
                    </div>
                    <div className="wrap-break-word text-xs text-white/60">
                      {inquiry.contactName}
                    </div>
                  </TableCell>
                  <TableCell className="p-4 align-top">
                    <div className="max-w-[240px] break-all text-white/70">
                      {inquiry.email}
                    </div>
                  </TableCell>
                  <TableCell className="p-4 align-top text-white/70">
                    {inquiry.phoneNumber}
                  </TableCell>
                  <TableCell className="p-4 align-top">
                    <StatusBadge status={inquiry.status} />
                  </TableCell>
                  <TableCell className="p-4 align-top text-white/70">
                    {formatDate(inquiry.createdAt)}
                  </TableCell>
                  <TableCell className="p-4 align-top">
                    <div className="flex items-center justify-end gap-2">
                      <PartnershipInquiryActionsMenu
                        inquiry={inquiry}
                        onView={() => setViewingInquiry(inquiry)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <PartnershipInquiryDetailsDialog
        inquiry={viewingInquiry}
        onClose={() => setViewingInquiry(null)}
      />
    </>
  );
}

function PartnershipInquiryActionsMenu({
  inquiry,
  onView,
}: {
  inquiry: PartnerInquiryRow;
  onView: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function runAction(label: string, action: (id: string) => Promise<void>) {
    startTransition(async () => {
      try {
        await action(inquiry.id);
        toast.success(label);
        router.refresh();
      } catch {
        toast.error("Failed to update partnership inquiry.");
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="outline"
          disabled={isPending}
          aria-label="Open partnership inquiry actions"
          className="size-9 border-white/10 bg-white/3 text-white hover:bg-white/10 hover:text-white"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="border-white/10 bg-zinc-950 text-white"
      >
        <DropdownMenuItem
          onClick={onView}
          className="cursor-pointer gap-2 focus:bg-white/10 focus:text-white"
        >
          <Eye className="size-4" />
          View Details
        </DropdownMenuItem>

        {inquiry.status === "new" ? (
          <>
            <DropdownMenuItem
              onClick={() =>
                runAction(
                  "Inquiry marked as contacted.",
                  markPartnerInquiryAsContacted,
                )
              }
              className="cursor-pointer text-emerald-400 focus:bg-emerald-500/10 focus:text-emerald-300"
            >
              Mark as Contacted
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                runAction("Inquiry rejected.", rejectPartnerInquiry)
              }
              className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-300"
            >
              Reject
            </DropdownMenuItem>
          </>
        ) : null}

        {inquiry.status === "contacted" ? (
          <>
            <DropdownMenuItem
              onClick={() =>
                runAction("Inquiry approved.", approvePartnerInquiry)
              }
              className="cursor-pointer text-emerald-400 focus:bg-emerald-500/10 focus:text-emerald-300"
            >
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                runAction("Inquiry rejected.", rejectPartnerInquiry)
              }
              className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-300"
            >
              Reject
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PartnershipInquiryDetailsDialog({
  inquiry,
  onClose,
}: {
  inquiry: PartnerInquiryRow | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={Boolean(inquiry)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-zinc-950 text-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-white">
            Partnership Inquiry
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Submitted business details and current review status.
          </DialogDescription>
        </DialogHeader>

        {inquiry ? (
          <div className="grid gap-3">
            <DetailRow label="Business Name" value={inquiry.businessName} />
            <DetailRow label="Contact Name" value={inquiry.contactName} />
            <DetailRow label="Email" value={inquiry.email} />
            <DetailRow label="Phone Number" value={inquiry.phoneNumber} />
            <DetailRow label="Website URL" value={inquiry.websiteUrl} />
            <DetailRow label="Facebook URL" value={inquiry.facebookUrl} />
            <DetailRow label="Message" value={inquiry.message} multiline />
            <DetailRow label="Status" value={formatStatus(inquiry.status)} />
            <DetailRow
              label="Date of Inquiry"
              value={formatDateTime(inquiry.createdAt)}
            />
            <DetailRow
              label="Last Updated"
              value={formatDateTime(inquiry.updatedAt)}
            />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
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

function DetailRow({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string | null;
  multiline?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/4 p-3">
      <div className="text-xs font-black uppercase tracking-widest text-white/50">
        {label}
      </div>
      <div
        className={[
          "mt-1 text-sm text-white/80",
          multiline ? "whitespace-pre-wrap wrap-break-word" : "break-all",
        ].join(" ")}
      >
        {value || "N/A"}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: PartnerInquiryStatus }) {
  if (status === "approved") {
    return (
      <Badge className="border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/10">
        Approved
      </Badge>
    );
  }

  if (status === "rejected") {
    return (
      <Badge className="border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/10">
        Rejected
      </Badge>
    );
  }

  if (status === "contacted") {
    return (
      <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/10">
        Contacted
      </Badge>
    );
  }

  return (
    <Badge className="border-yellow-500/20 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/10">
      New
    </Badge>
  );
}

function formatStatus(status: PartnerInquiryStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}
