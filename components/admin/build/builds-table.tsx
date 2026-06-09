"use client";

import Image from "next/image";
import { Eye } from "lucide-react";

import { AdminBuildRow } from "@/lib/constants/build";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { BuildStatusAction } from "./build-status-action";

type Props = {
  builds: AdminBuildRow[];
  onView: (build: AdminBuildRow) => void;
  onPublish: (buildId: string) => void;
  onReject: (buildId: string) => void;
};

export function BuildsTable({ builds, onView, onPublish, onReject }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/4">
      <div className="overflow-x-auto">
        <Table className="min-w-275">
          <TableHeader>
            <TableRow className="border-white/10 bg-white/3 hover:bg-white/3">
              <TableHead className="p-4 text-xs font-black uppercase text-center tracking-widest text-white/50">
                Build
              </TableHead>
              <TableHead className="p-4 text-xs font-black uppercase text-center tracking-widest text-white/50">
                Owner
              </TableHead>
              <TableHead className="p-4 text-xs font-black uppercase text-center tracking-widest text-white/50">
                Model
              </TableHead>
              <TableHead className="p-4 text-xs font-black uppercase text-center tracking-widest text-white/50">
                Concept
              </TableHead>
              <TableHead className="p-4 text-xs font-black uppercase text-center tracking-widest text-white/50">
                Featured
              </TableHead>
              <TableHead className="p-4 text-xs font-black uppercase text-center tracking-widest text-white/50">
                Status
              </TableHead>
              <TableHead className="p-4 text-xs font-black uppercase text-center tracking-widest text-white/50">
                Submitted
              </TableHead>
              <TableHead className="p-4 text-xs font-black text-center uppercase tracking-widest text-white/50">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {builds.map((build) => (
              <TableRow
                key={build.id}
                className="border-white/10 text-sm text-white/80 hover:bg-white/3"
              >
                <TableCell className="p-4 text-center">
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black">
                      {build.coverImageUrl ? (
                        <Image
                          src={build.coverImageUrl}
                          alt={build.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-[10px] text-white/30">
                          N/A
                        </div>
                      )}
                    </div>

                    <span className="font-black text-white">{build.title}</span>
                  </div>
                </TableCell>

                <TableCell className="p-4 text-center text-white/70">
                  {build.ownerNickname ||
                    build.ownerCodename ||
                    build.ownerEmail}
                </TableCell>

                <TableCell className="p-4 text-center text-white/70">
                  {build.motorcycleModel}
                </TableCell>

                <TableCell className="p-4 text-center text-white/70">
                  {build.concept || "—"}
                </TableCell>

                <TableCell className="p-4 text-center text-white/70">
                  {build.isFeatured ? "Yes" : "No"}
                </TableCell>

                <TableCell className="p-4 text-center">
                  <BuildStatusBadge status={build.status} />
                </TableCell>

                <TableCell className="p-4 text-center text-white/70">
                  {new Date(build.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>

                <TableCell className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => onView(build)}
                      aria-label="View member details"
                      className=" border-white/10 bg-white/3 text-white hover:bg-white/10 hover:text-white"
                    >
                      <Eye />
                    </Button>

                    <BuildStatusAction
                      status={build.status}
                      onPublish={() => onPublish(build.id)}
                      onReject={() => onReject(build.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {builds.length === 0 && (
        <div className="p-10 text-center text-sm text-white/40">
          No builds found.
        </div>
      )}
    </div>
  );
}

function BuildStatusBadge({ status }: { status: AdminBuildRow["status"] }) {
  const label = status.replace("_", " ");

  if (status === "published") {
    return (
      <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-bold capitalize text-green-400">
        {label}
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold capitalize text-red-400">
        {label}
      </span>
    );
  }

  if (status === "for_review") {
    return (
      <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-bold capitalize text-yellow-400">
        For Review
      </span>
    );
  }

  return (
    <span className="rounded-full border border-white/10 bg-white/4 px-3 py-1 text-xs font-bold capitalize text-white/60">
      {label}
    </span>
  );
}
