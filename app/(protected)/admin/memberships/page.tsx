import { MembershipApprovalsTable } from "@/components/membership/membership-approvals-table";
import {
  getMembershipApprovalFilterOptions,
  getMembershipApprovals,
} from "./queries";
import { MembershipApprovalsFilter } from "@/components/membership/membership-approvals-filter";

type MembershipApprovalsPageProps = {
  searchParams: Promise<{
    search?: string;
    chapter?: string;
    unit?: string;
  }>;
};

export default async function MembershipApprovalsPage({
  searchParams,
}: MembershipApprovalsPageProps) {
  const params = await searchParams;

  const [{ members }, filterOptions] = await Promise.all([
    getMembershipApprovals({
      search: params.search,
      chapter: params.chapter,
      unit: params.unit,
    }),
    getMembershipApprovalFilterOptions(),
  ]);

  return (
    <div className="space-y-6">
      <MembershipApprovalsFilter
        chapters={filterOptions.chapters}
        units={filterOptions.units}
      />

      <div className="p-4">
        <MembershipApprovalsTable members={members} />
      </div>
    </div>
  );
}
