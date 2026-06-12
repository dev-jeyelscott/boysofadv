"use client";

import Image from "next/image";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";

import { getPublishedBuilds } from "./actions";
import { useState } from "react";

type BuildItem = Awaited<
  ReturnType<typeof getPublishedBuilds>
>["builds"][number];

type Props = {
  initialBuilds: BuildItem[];
  initialHasMore: boolean;
  search?: string;
};

export function BuildsInfiniteGrid({
  initialBuilds,
  initialHasMore,
  search,
}: Props) {
  const [builds, setBuilds] = useState<BuildItem[]>(initialBuilds);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [offset, setOffset] = useState(initialBuilds.length);

  async function loadMoreBuilds() {
    const result = await getPublishedBuilds(offset, search ?? "");

    setBuilds((current) => [...current, ...result.builds]);
    setHasMore(result.hasMore);
    setOffset((current) => current + result.builds.length);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <InfiniteScroll
        dataLength={builds.length}
        next={loadMoreBuilds}
        hasMore={hasMore}
        scrollThreshold={0.85}
        loader={<BuildsLoader />}
        endMessage={<BuildsEndMessage />}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {builds.map((build) => (
            <BuildCard key={build.id} build={build} />
          ))}
        </div>
      </InfiniteScroll>
    </section>
  );
}

function BuildCard({ build }: { build: BuildItem }) {
  const owner =
    build.ownerCodename ||
    build.ownerNickname ||
    [build.ownerFirstName, build.ownerLastName].filter(Boolean).join(" ") ||
    "ADV Member";

  return (
    <Link
      href={`/builds/${build.id}`}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/4 transition hover:-translate-y-1 hover:border-red-500/50 hover:bg-white/[0.07]"
    >
      <div className="relative aspect-square overflow-hidden bg-white/3">
        {build.coverImageUrl ? (
          <Image
            src={build.coverImageUrl}
            alt={build.title ?? "Member build"}
            fill
            loading="lazy"
            quality={75}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 240px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-black uppercase tracking-widest text-white/30">
            No Image
          </div>
        )}

        {build.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
            Featured
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 text-lg font-black uppercase text-white">
          {build.title || "Untitled Build"}
        </h3>

        <p className="mt-1 line-clamp-1 text-sm font-bold uppercase tracking-wider text-red-500">
          {owner}
        </p>

        <div className="mt-4 space-y-1 text-sm text-white/50">
          <p className="line-clamp-1">{build.motorcycleModel || "Honda ADV"}</p>

          <p className="line-clamp-1">
            {[build.yearModel, build.concept].filter(Boolean).join(" • ") ||
              "Custom Build"}
          </p>
        </div>
      </div>
    </Link>
  );
}

function BuildsLoader() {
  return (
    <div className="py-10 text-center text-xs font-black uppercase tracking-[0.3em] text-white/40">
      Loading more builds...
    </div>
  );
}

function BuildsEndMessage() {
  return (
    <div className="py-10 text-center text-xs font-black uppercase tracking-[0.3em] text-white/30">
      No more builds to load
    </div>
  );
}
