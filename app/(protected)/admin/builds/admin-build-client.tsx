"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { AdminBuildRow } from "@/lib/constants/build";
import {
  publishBuild,
  rejectBuild,
} from "@/app/(protected)/admin/builds/actions";
import { BuildsTable } from "@/components/admin/build/builds-table";

type Props = {
  builds: AdminBuildRow[];
};

export function AdminBuildsClient({ builds }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  return (
    <BuildsTable
      builds={builds}
      onView={handleView}
      onPublish={handlePublish}
      onReject={handleReject}
    />
  );
}
