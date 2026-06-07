"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const builds = [
  {
    title: "ADV 160 TOURING BEAST",
    owner: "Juan Dela Cruz",
    image: "/images/build-01.jpg",
    mods: [
      "JVT V3 Exhaust",
      "RCB Suspension",
      "GIVI Aluminum Box",
      "Auxiliary Lights",
    ],
  },
  {
    title: "ADV 160 URBAN WARRIOR",
    owner: "Mark Anthony",
    image: "/images/build-02.jpg",
    mods: [
      "Motowolf Accessories",
      "Pirelli Angel Scooter",
      "RCB Brake System",
      "Dark Smoke Shield",
    ],
  },
  {
    title: "ADV 150 ADVENTURE READY",
    owner: "Kelvin Reyes",
    image: "/images/build-03.jpg",
    mods: [
      "GIVI Top Box",
      "Michelin City Grip 2",
      "Hella Auxiliary Lights",
      "Custom Crash Bar",
    ],
  },
  {
    title: "ADV 160 BLACK DIAMOND",
    owner: "Patrick Rosales",
    image: "/images/build-04.jpg",
    mods: [
      "Akrapovic Exhaust",
      "Öhlins Suspension",
      "Carbon Fiber Parts",
      "LED Fog Lights",
    ],
  },
  {
    title: "ADV 150 STREET EXPLORER",
    owner: "Flair Villan",
    image: "/images/build-05.jpg",
    mods: [
      "RCB Handguard",
      "Bridgestone Battlax",
      "Motowolf Box Rack",
      "Dual Disc Setup",
    ],
  },
];



export function FeaturedBuildsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
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

  return (
    <section id="builds" className="relative overflow-hidden bg-black py-10">
      <div className="mx-auto max-w-7xl px-4 my-10">
        {/* Heading */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-red-600/40" />
          <h2 className="text-center text-3xl font-black uppercase tracking-wider italic text-white">
            Featured{" "}
            <span className="text-red-600">Builds</span>
          </h2>
          <div className="h-px flex-1 bg-red-600/40" />
        </div>

        <div className="relative">
          {/* Left Button */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded bg-red-600 p-3 text-white transition hover:bg-red-500"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Button */}
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded bg-red-600 p-3 text-white transition hover:bg-red-500"
          >
            <ChevronRight size={20} />
          </button>

          {/* Carousel */}
          <div className="overflow-hidden px-12" ref={emblaRef}>
            <div className="flex gap-4">
              {builds.map((build) => (
                <div
                  key={build.title}
                  className="min-w-[280px] flex-[0_0_280px] overflow-hidden border border-white/10 bg-zinc-950"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={build.image}
                      alt={build.title}
                      className="h-full w-full object-cover transition duration-500 hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="border-t border-red-600/30 p-4">
                    <h3 className="mb-2 text-sm font-black uppercase text-white">
                      {build.title}
                    </h3>

                    <p className="mb-3 text-xs text-zinc-400">
                      Owner: {build.owner}
                    </p>

                    <ul className="space-y-1 text-xs text-zinc-300">
                      {build.mods.map((mod) => (
                        <li key={mod} className="flex gap-2">
                          <span className="text-red-500">•</span>
                          {mod}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
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
        </div>
      </div>
    </section>
  );
}