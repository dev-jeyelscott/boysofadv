"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "sonner";

import { AdminBuildRow, type BuildStatus } from "@/lib/constants/build";
import {
  loadMoreAdminBuilds,
  publishBuild,
  rejectBuild,
} from "@/app/(protected)/admin/builds/actions";
import { BuildsTable } from "@/components/admin/build/builds-table";

type Props = {
  builds: AdminBuildRow[];
  nextCursor: string | null;
  hasMore: boolean;
  filters: {
    search?: string;
    model?: string;
    concept?: string;
    status?: BuildStatus;
    isFeatured?: string;
  };
};

export function AdminBuildsClient({
  builds: initialBuilds,
  nextCursor: initialNextCursor,
  hasMore: initialHasMore,
  filters,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [builds, setBuilds] = useState(initialBuilds);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);

  function handleView(build: AdminBuildRow) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("buildId", build.id);

    router.push(`/admin/builds?${params.toString()}`);
  }

  async function handlePublish(buildId: string) {
    await publishBuild(buildId);
    toast.success("Build published.");
    router.refresh();
  }

  async function handleReject(buildId: string) {
    await rejectBuild(buildId);
    toast.success("Build rejected.");
    router.refresh();
  }

  async function loadMoreBuilds() {
    if (!nextCursor) {
      setHasMore(false);
      return;
    }

    const result = await loadMoreAdminBuilds({
      ...filters,
      cursor: nextCursor,
    });

    setBuilds((current) => [...current, ...result.itemsWithGalleryImages]);
    setNextCursor(result.nextCursor);
    setHasMore(result.hasMore);
  }

  return (
    <InfiniteScroll
      dataLength={builds.length}
      next={loadMoreBuilds}
      hasMore={hasMore}
      scrollThreshold={0.85}
      loader={<AdminTableLoader label="Loading more builds..." />}
      endMessage={
        builds.length > 0 ? (
          <AdminTableEndMessage label="No more builds to load" />
        ) : null
      }
    >
      <BuildsTable
        builds={builds}
        onView={handleView}
        onPublish={handlePublish}
        onReject={handleReject}
      />
    </InfiniteScroll>
  );
}

function AdminTableLoader({ label }: { label: string }) {
  return (
    <div className="py-8 text-center text-xs font-black uppercase tracking-[0.3em] text-white/70">
      {label}
    </div>
  );
}

function AdminTableEndMessage({ label }: { label: string }) {
  return (
    <div className="py-8 text-center text-xs font-black uppercase tracking-[0.3em] text-white/30">
      {label}
    </div>
  );
}
