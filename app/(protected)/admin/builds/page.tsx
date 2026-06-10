import { BuildsFilters } from "@/components/admin/build/builds-filter";
import { getAdminBuilds } from "./queries";
import { BuildDetailsDialogClient } from "./build-details-dialog-client";
import { AdminBuildsClient } from "./admin-build-client";
import { BuildStatus } from "@/lib/constants/build";

type Props = {
  searchParams: Promise<{
    search?: string;
    model?: string;
    concept?: string;
    status?: BuildStatus;
    isFeatured?: string;
    buildId?: string;
  }>;
};

export default async function AdminBuildsPage({ searchParams }: Props) {
  const params = await searchParams;

  const data = await getAdminBuilds({
    search: params.search,
    model: params.model,
    concept: params.concept,
    status: params.status,
    isFeatured: params.isFeatured,
  });

  const selectedBuild = params.buildId
    ? (data.itemsWithGalleryImages.find(
        (build) => build.id === params.buildId,
      ) ?? null)
    : null;

  return (
    <div className="space-y-6">
      <BuildsFilters
        search={params.search || ""}
        model={params.model || ""}
        concept={params.concept || ""}
        status={params.status || ""}
        isFeatured={params.isFeatured || ""}
      />
      <div className="p-4">
        <AdminBuildsClient builds={data.itemsWithGalleryImages} />
      </div>

      <BuildDetailsDialogClient build={selectedBuild} />
    </div>
  );
}
