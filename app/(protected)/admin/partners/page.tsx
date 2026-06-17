import { PartnersFilters } from "@/components/admin/partners/partners-filters";
import { getPartnerFilterOptions, getPartners } from "./quiries";
import { AddPartnerDialog } from "@/components/admin/partners/add-partner-dialog";
import { AdminPartnersClient } from "./admin-partners-client";

type PartnersPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    category?: string;
  }>;
};

export default async function PartnersPage({
  searchParams,
}: PartnersPageProps) {
  const params = await searchParams;

  const [partnersData, filterOptions] = await Promise.all([
    getPartners({
      search: params.search,
      status: params.status,
      category: params.category,
    }),
    getPartnerFilterOptions(),
  ]);

  return (
    <div>
      <PartnersFilters
        search={params.search ?? ""}
        category={params.category ?? ""}
        status={params.status ?? ""}
        categories={filterOptions.categories}
      />

      <div className="flex justify-end px-4 py-2">
        <AddPartnerDialog />
      </div>

      <div className="p-4">
        <AdminPartnersClient
          key={[params.search, params.status, params.category].join(":")}
          partners={partnersData.partners}
          nextCursor={partnersData.nextCursor}
          hasMore={partnersData.hasMore}
          filters={{
            search: params.search,
            status: params.status,
            category: params.category,
          }}
        />
      </div>
    </div>
  );
}
