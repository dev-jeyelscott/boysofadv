import { MembersFilters } from "@/components/admin/members/members-filters";
import { MembersTable } from "@/components/admin/members/members-table";
import { getMemberFilterOptions, getMembers } from "./queries";

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

  const [{ members }, filterOptions] = await Promise.all([
    getMembers({
      search: params.search,
      status: params.status,
      chapter: params.chapter,
      unit: params.unit,
    }),
    getMemberFilterOptions(),
  ]);

  return (
    <div className="grid gap-5">
      <MembersFilters
        chapters={filterOptions.chapters}
        units={filterOptions.units}
      />

      <MembersTable members={members} />
    </div>
  );
}
