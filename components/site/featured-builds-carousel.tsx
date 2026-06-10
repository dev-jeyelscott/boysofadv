"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type CarouselBuild = {
  id: string;
  title: string;
  owner: string;
  image: string;
  mods: string[];
};

type FeaturedBuildsCarouselProps = {
  builds: CarouselBuild[];
};

export function FeaturedBuildsCarousel({
  builds,
}: FeaturedBuildsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: builds.length > 1,
    align: "start",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollSnaps = builds.map((_, index) => index);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section id="builds" className="relative overflow-hidden bg-black py-6">
      <div className="mx-auto my-10 max-w-7xl px-4">
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-red-600/40" />
          <h2 className="text-center text-3xl font-black uppercase tracking-wider italic text-white">
            Featured <span className="text-red-600">Builds</span>
          </h2>
          <div className="h-px flex-1 bg-red-600/40" />
        </div>

        <div className="relative">
          {builds.length > 1 ? (
            <>
              <button
                type="button"
                onClick={scrollPrev}
                className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded bg-red-600 p-3 text-white transition hover:bg-red-500"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={scrollNext}
                className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded bg-red-600 p-3 text-white transition hover:bg-red-500"
              >
                <ChevronRight size={20} />
              </button>
            </>
          ) : null}

          <div className="overflow-hidden px-12 py-5" ref={emblaRef}>
            <div className="flex gap-4">
              {builds.map((build) => (
                <div key={build.id} className="flex flex-[0_0_280px] px-1 py-3">
                  <Link
                    href={`/builds/${build.id}`}
                    className="flex w-full cursor-pointer"
                  >
                    <div className="group flex min-h-125 w-full flex-col overflow-hidden border border-white/10 bg-zinc-950 transition-all duration-300 ease-out hover:-translate-y-3 hover:scale-[1.02] hover:border-red-600/70 hover:bg-zinc-900 hover:shadow-[0_0_30px_rgba(220,38,38,0.25)]">
                      <div className="relative h-56 shrink-0 overflow-hidden">
                        <Image
                          src={build.image}
                          alt={build.title}
                          fill
                          sizes="280px"
                          className="object-cover"
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                      </div>

                      <div className="flex flex-1 flex-col border-t border-red-600/30 p-4">
                        <h3 className="mb-2 line-clamp-2 text-sm font-black uppercase text-white">
                          {build.title}
                        </h3>

                        <p className="mb-3 text-xs text-zinc-400">
                          Owner: {build.owner}
                        </p>

                        <ul className="space-y-1 text-xs text-zinc-300">
                          {build.mods.slice(0, 4).map((mod) => (
                            <li key={mod} className="line-clamp-2 flex gap-2">
                              <span className="shrink-0 text-red-500">•</span>
                              <span>{mod}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-auto pt-4">
                          <div className="flex items-center justify-center rounded-md border border-red-600/40 bg-red-600/10 px-3 py-2 text-xs font-black uppercase tracking-wider text-red-500 transition-all duration-300 group-hover:border-red-500 group-hover:bg-red-600/20 group-hover:text-red-400">
                            View Full Specs →
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {builds.length > 1 ? (
            <div className="mt-6 flex justify-center gap-2">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={
                    selectedIndex === index
                      ? "h-2.5 w-2.5 rounded-full bg-red-600"
                      : "h-2.5 w-2.5 rounded-full bg-white/30 transition hover:bg-white/60"
                  }
                />
              ))}
            </div>
          ) : null}
        </div>

        {builds.length > 5 ? (
          <>
            <div className="mt-5 flex justify-center">
              <Link
                href="/builds"
                className="hidden items-center -skew-x-12 gap-2 rounded-sm border border-red-700/70 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-red-700 sm:flex"
              >
                <span className="skew-x-12">View All Builds</span>
                <span className="skew-x-12 text-red-500">›</span>
              </Link>
            </div>

            <div className="mt-5 flex justify-center sm:hidden">
              <Link
                href="/builds"
                className="-skew-x-12 rounded-sm border border-red-700/70 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-red-700"
              >
                <span className="inline-block skew-x-12">
                  View All Builds <span className="text-red-500">›</span>
                </span>
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
