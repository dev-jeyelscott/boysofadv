"use client";

import { AdminBuildRow } from "@/lib/constants/build";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { BuildActionMenu } from "./build-action-menu";

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
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow className="border-white/10 bg-white/3 hover:bg-white/3">
              <TableHead className="w-[18%] p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Build
              </TableHead>

              <TableHead className="w-[15%] p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Owner
              </TableHead>

              <TableHead className="w-[15%] p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Model
              </TableHead>

              <TableHead className="w-[20%] p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Concept
              </TableHead>

              <TableHead className="w-[8%] p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Featured
              </TableHead>

              <TableHead className="w-[10%] p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Status
              </TableHead>

              <TableHead className="w-[10%] p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
                Submitted
              </TableHead>

              <TableHead className="w-[12%] p-4 text-center text-xs font-black uppercase tracking-widest text-white/50">
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
                <TableCell className="p-4 align-top text-center">
                  <div className="whitespace-normal break-words font-black text-white">
                    {build.title}
                  </div>
                </TableCell>

                <TableCell className="p-4 align-top text-center text-white/70">
                  <div className="whitespace-normal break-all">
                    {build.ownerNickname ||
                      build.ownerCodename ||
                      build.ownerEmail}
                  </div>
                </TableCell>

                <TableCell className="p-4 align-top text-center text-white/70">
                  <div className="whitespace-normal break-words">
                    {build.motorcycleModel}
                  </div>
                </TableCell>

                <TableCell className="p-4 align-top text-center text-white/70">
                  <div className="whitespace-normal break-words">
                    {build.concept || "—"}
                  </div>
                </TableCell>

                <TableCell className="p-4 align-top text-center text-white/70">
                  {build.isFeatured ? "Yes" : "No"}
                </TableCell>

                <TableCell className="p-4 align-top text-center">
                  <BuildStatusBadge status={build.status} />
                </TableCell>

                <TableCell className="p-4 align-top text-center text-white/70">
                  {new Date(build.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>

                <TableCell className="p-4 align-top text-center">
                  <div className="flex justify-center">
                    <BuildActionMenu
                      status={build.status}
                      onView={() => onView(build)}
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
      <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-400">
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
