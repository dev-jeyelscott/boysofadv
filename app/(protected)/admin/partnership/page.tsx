import { PartnershipInquiriesFilter } from "@/components/admin/partnership/partnership-inquiries-filter";
import { PartnershipInquiriesTable } from "@/components/admin/partnership/partnership-inquiries-table";
import { PartnershipService } from "@/src/features/partnerships/services/partnership-service";

type PartnershipPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
};

export default async function PartnershipPage({
  searchParams,
}: PartnershipPageProps) {
  const params = await searchParams;

  const inquiries = await PartnershipService.getPartnerInquiries({
    search: params.search,
    status: params.status,
  });

  return (
    <div className="space-y-6">
      <PartnershipInquiriesFilter
        search={params.search ?? ""}
        status={params.status ?? ""}
      />

      <div className="p-4">
        <PartnershipInquiriesTable inquiries={inquiries} />
      </div>
    </div>
  );
}
