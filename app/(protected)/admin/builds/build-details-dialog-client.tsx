"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { AdminBuildRow } from "@/lib/constants/build";
import { BuildDetailsDialog } from "@/components/admin/build/build-details-modal";

type Props = {
  build: AdminBuildRow | null;
};

export function BuildDetailsDialogClient({ build }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleClose() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("buildId");

    const query = params.toString();
    router.push(query ? `/admin/builds?${query}` : "/admin/builds");
  }

  return <BuildDetailsDialog build={build} onClose={handleClose} />;
}
