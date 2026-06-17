"use client";

import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { loadMoreAdminMembers } from "@/app/(protected)/admin/members/actions";
import {
  MembersTable,
  type MemberRow,
} from "@/components/admin/members/members-table";

type Props = {
  members: MemberRow[];
  nextCursor: string | null;
  hasMore: boolean;
  filters: {
    search?: string;
    status?: string;
    chapter?: string;
    unit?: string;
  };
};

export function AdminMembersClient({
  members: initialMembers,
  nextCursor: initialNextCursor,
  hasMore: initialHasMore,
  filters,
}: Props) {
  const [members, setMembers] = useState(initialMembers);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);

  async function loadMoreMembers() {
    if (!nextCursor) {
      setHasMore(false);
      return;
    }

    const result = await loadMoreAdminMembers({
      ...filters,
      cursor: nextCursor,
    });

    setMembers((current) => [...current, ...result.members]);
    setNextCursor(result.nextCursor);
    setHasMore(result.hasMore);
  }

  return (
    <InfiniteScroll
      dataLength={members.length}
      next={loadMoreMembers}
      hasMore={hasMore}
      scrollThreshold={0.85}
      loader={<AdminTableLoader label="Loading more members..." />}
      endMessage={
        members.length > 0 ? (
          <AdminTableEndMessage label="No more members to load" />
        ) : null
      }
    >
      <MembersTable members={members} />
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
