"use client";

import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { loadMoreAdminPartners } from "@/app/(protected)/admin/partners/actions";
import { PartnersTable } from "@/components/admin/partners/partners-table";
import { type PartnerRow } from "@/lib/constants/partner";

type Props = {
  partners: PartnerRow[];
  nextCursor: string | null;
  hasMore: boolean;
  filters: {
    search?: string;
    status?: string;
    category?: string;
  };
};

export function AdminPartnersClient({
  partners: initialPartners,
  nextCursor: initialNextCursor,
  hasMore: initialHasMore,
  filters,
}: Props) {
  const [partners, setPartners] = useState(initialPartners);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);

  async function loadMorePartners() {
    if (!nextCursor) {
      setHasMore(false);
      return;
    }

    const result = await loadMoreAdminPartners({
      ...filters,
      cursor: nextCursor,
    });

    setPartners((current) => [...current, ...result.partners]);
    setNextCursor(result.nextCursor);
    setHasMore(result.hasMore);
  }

  return (
    <InfiniteScroll
      dataLength={partners.length}
      next={loadMorePartners}
      hasMore={hasMore}
      scrollThreshold={0.85}
      loader={<AdminTableLoader label="Loading more partners..." />}
      endMessage={
        partners.length > 0 ? (
          <AdminTableEndMessage label="No more partners to load" />
        ) : null
      }
    >
      <PartnersTable partners={partners} />
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
