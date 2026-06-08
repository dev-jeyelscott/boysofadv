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
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

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

    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (builds.length === 0) {
    return null;
  }

  return (
    <section id="builds" className="relative overflow-hidden bg-black py-10">
      <div className="mx-auto my-10 max-w-7xl px-4">
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-red-600/40" />
          <h2 className="text-center text-3xl font-black uppercase tracking-wider italic text-white">
            Featured <span className="text-red-600">Builds</span>
          </h2>
          <div className="h-px flex-1 bg-red-600/40" />
        </div>

        <div className="relative">
          {builds.length > 1 && (
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
          )}

          <div className="overflow-hidden px-12 py-5" ref={emblaRef}>
            <div className="flex gap-4">
              {builds.map((build) => (
                <div key={build.id} className="flex-[0_0_280px] px-1 py-3">
                  <Link href={`/builds/${build.id}`} className="cursor-pointer">
                    <div className="group overflow-hidden border border-white/10 bg-zinc-950 transition-all duration-300 ease-out hover:-translate-y-3 hover:scale-[1.02] hover:border-red-600/70 hover:bg-zinc-900 hover:shadow-[0_0_30px_rgba(220,38,38,0.25)]">
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={build.image}
                          alt={build.title}
                          fill
                          sizes="280px"
                          className="object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      </div>

                      <div className="border-t border-red-600/30 p-4">
                        <h3 className="mb-2 text-sm font-black uppercase text-white">
                          {build.title}
                        </h3>

                        <p className="mb-3 text-xs text-zinc-400">
                          Owner: {build.owner}
                        </p>

                        <ul className="space-y-1 text-xs text-zinc-300">
                          {build.mods.slice(0, 4).map((mod) => (
                            <li key={mod} className="flex gap-2">
                              <span className="text-red-500">•</span>
                              {mod}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {builds.length > 1 && (
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
          )}
        </div>
      </div>
    </section>
  );
}
