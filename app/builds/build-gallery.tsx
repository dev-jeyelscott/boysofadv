"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";

type BuildGalleryImage = {
  id: string;
  imageUrl: string;
  caption: string | null;
};

type Props = {
  images: BuildGalleryImage[];
  buildTitle: string;
};

export function BuildGallery({ images, buildTitle }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeImage = activeIndex !== null ? images[activeIndex] : null;

  function previousImage() {
    if (activeIndex === null) return;

    setActiveIndex((activeIndex - 1 + images.length) % images.length);
  }

  function nextImage() {
    if (activeIndex === null) return;

    setActiveIndex((activeIndex + 1) % images.length);
  }

  return (
    <>
      <section className="mt-12">
        <div className="mb-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-red-600/40" />
          <h2 className="text-center text-2xl font-black uppercase tracking-tight md:text-3xl">
            Build Gallery
          </h2>
          <div className="h-px flex-1 bg-red-600/40" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/4 text-left"
            >
              <div className="relative aspect-4/3 bg-neutral-900">
                <Image
                  src={image.imageUrl}
                  alt={image.caption || buildTitle}
                  fill
                  loading="lazy"
                  quality={75}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              {image.caption ? (
                <div className="border-t border-white/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/50">
                    {image.caption}
                  </p>
                </div>
              ) : null}
            </button>
          ))}
        </div>
      </section>

      {activeImage ? (
        <div className="fixed inset-0 z-100 bg-black/90 p-4 backdrop-blur">
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute right-5 top-5 z-10 rounded-full border border-white/10 bg-white/10 p-3 text-white hover:bg-red-600"
          >
            <X className="size-5" />
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={previousImage}
                className="absolute left-5 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 p-3 text-white hover:bg-red-600"
              >
                <ChevronLeft className="size-6" />
              </button>

              <button
                type="button"
                onClick={nextImage}
                className="absolute right-5 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 p-3 text-white hover:bg-red-600"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          ) : null}

          <div className="flex h-full items-center justify-center">
            <div className="w-full max-w-6xl">
              <div className="relative h-[80vh] w-full overflow-hidden rounded-3xl md:h-[90vh]">
                <Image
                  loading="lazy"
                  quality={75}
                  src={activeImage.imageUrl}
                  alt={activeImage.caption || buildTitle}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>

              {activeImage.caption ? (
                <p className="mt-4 text-center text-sm font-bold uppercase tracking-widest text-white/60">
                  {activeImage.caption}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
