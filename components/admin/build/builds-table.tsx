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
  onPublish: (buildId: string, stringId: string) => void;
  onReject: (buildId: string, stringId: string) => void;
};

export function BuildsTable({ builds, onView, onPublish, onReject }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/4">
      {/* Mobile cards */}
      <div className="grid gap-3 p-3 lg:hidden">
        {builds.map((build) => (
          <article
            key={build.id}
            className="rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="break-words text-base font-black uppercase leading-tight text-white">
                  {build.title}
                </h3>

                <p className="mt-1 break-all text-xs text-white/50">
                  {build.ownerNickname ||
                    build.ownerCodename ||
                    build.ownerEmail}
                </p>
              </div>

              <BuildActionMenu
                status={build.status}
                onView={() => onView(build)}
                onPublish={() => onPublish(build.id, build.ownerId)}
                onReject={() => onReject(build.id, build.ownerId)}
              />
            </div>

            <div className="mt-4 grid gap-3 text-sm">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-white/40">
                  Model
                </p>
                <p className="mt-1 break-words text-white/80">
                  {build.motorcycleModel}
                </p>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-white/40">
                  Concept
                </p>
                <p className="mt-1 break-words text-white/70">
                  {build.concept || "—"}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-white/40">
                    Featured
                  </p>
                  <p className="mt-1 text-white/70">
                    {build.isFeatured ? "Yes" : "No"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-white/40">
                    Status
                  </p>
                  <div className="mt-1">
                    <BuildStatusBadge status={build.status} />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-white/40">
                    Submitted
                  </p>
                  <p className="mt-1 text-white/70">
                    {new Date(build.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden lg:block">
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
                    <div className="break-words font-black text-white">
                      {build.title}
                    </div>
                  </TableCell>

                  <TableCell className="p-4 align-top text-center text-white/70">
                    <div className="break-all">
                      {build.ownerNickname ||
                        build.ownerCodename ||
                        build.ownerEmail}
                    </div>
                  </TableCell>

                  <TableCell className="p-4 align-top text-center text-white/70">
                    <div className="break-words">{build.motorcycleModel}</div>
                  </TableCell>

                  <TableCell className="p-4 align-top text-center text-white/70">
                    <div className="break-words">{build.concept || "—"}</div>
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
                        onPublish={() => onPublish(build.id, build.ownerId)}
                        onReject={() => onReject(build.id, build.ownerId)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
