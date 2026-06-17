import { MembersFilters } from "@/components/admin/members/members-filters";
import { getMemberFilterOptions, getMembers } from "./queries";
import { AdminMembersClient } from "./admin-members-client";

type MembersPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    chapter?: string;
    unit?: string;
  }>;
};

export default async function MembersPage({ searchParams }: MembersPageProps) {
  const params = await searchParams;

  const [membersData, filterOptions] = await Promise.all([
    getMembers({
      search: params.search,
      status: params.status,
      chapter: params.chapter,
      unit: params.unit,
    }),
    getMemberFilterOptions(),
  ]);

  return (
    <div className="space-y-6">
      <MembersFilters
        chapters={filterOptions.chapters}
        units={filterOptions.units}
      />
      <div className="p-4">
        <AdminMembersClient
          key={[params.search, params.status, params.chapter, params.unit].join(
            ":",
          )}
          members={membersData.members}
          nextCursor={membersData.nextCursor}
          hasMore={membersData.hasMore}
          filters={{
            search: params.search,
            status: params.status,
            chapter: params.chapter,
            unit: params.unit,
          }}
        />
      </div>
    </div>
  );
}
