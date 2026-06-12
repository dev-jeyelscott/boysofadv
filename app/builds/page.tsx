import { SiteHeader } from "@/components/site/site-header";

import { getPublishedBuilds } from "./actions";
import { BuildsInfiniteGrid } from "./builds-infinite-grid";
import { BuildsSearch } from "@/components/builds/buil-search";

type BuildsPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function BuildsPage({ searchParams }: BuildsPageProps) {
  const { q } = await searchParams;
  const search = q ?? "";

  const { builds, hasMore } = await getPublishedBuilds(0, search);

  return (
    <main className="min-h-screen bg-black text-white">
      <SiteHeader />

      <section className="relative overflow-hidden px-4 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.18),transparent_35%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-red-600/40" />

            <h1 className="text-center text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
              Member&apos;s Builds
            </h1>

            <div className="h-px flex-1 bg-red-600/40" />
          </div>

          <p className="mx-auto mb-8 max-w-2xl text-center text-sm leading-7 text-white/60 md:text-base">
            Explore published Honda ADV builds from the community — engine
            setups, CVT setups, concepts, and featured member machines.
          </p>

          <BuildsSearch key={search} currentSearch={search} />
        </div>

        <BuildsInfiniteGrid
          key={search}
          initialBuilds={builds}
          initialHasMore={hasMore}
          search={search}
        />
      </section>
    </main>
  );
}
