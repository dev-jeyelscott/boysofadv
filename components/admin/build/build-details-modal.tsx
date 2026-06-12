"use client";

import Image from "next/image";

import { AdminBuildRow } from "@/lib/constants/build";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  build: AdminBuildRow | null;
  onClose: () => void;
};

export function BuildDetailsDialog({ build, onClose }: Props) {
  const open = Boolean(build);

  if (!build) return null;

  const ownerName =
    build.ownerNickname ||
    build.ownerCodename ||
    [build.ownerFirstName, build.ownerLastName].filter(Boolean).join(" ") ||
    build.ownerEmail;

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-h-[92dvh] w-[calc(100vw-1rem)] overflow-hidden rounded-2xl border-white/10 bg-zinc-950 p-0 text-white sm:w-[calc(100vw-2rem)] sm:max-w-3xl lg:max-w-6xl">
        <DialogHeader className="border-b border-white/10 px-4 py-4 sm:px-6">
          <DialogTitle className="line-clamp-2 text-lg font-black uppercase leading-tight sm:text-2xl">
            {build.title || "Untitled Build"}
          </DialogTitle>

          <p className="line-clamp-1 text-xs text-white/40 sm:text-sm">
            Owner: {ownerName}
          </p>
        </DialogHeader>

        <div className="max-h-[calc(92dvh-88px)] overflow-y-auto no-scrollbar lg:grid lg:grid-cols-[420px_1fr]">
          <div className="border-b border-white/10 p-4 sm:p-6 lg:border-b-0 lg:border-r">
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-white/10 bg-black sm:aspect-square">
              {build.coverImageUrl ? (
                <Image
                  src={build.coverImageUrl}
                  alt={build.title || "Build cover"}
                  fill
                  loading="lazy"
                  quality={75}
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-contain sm:object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-xs font-black uppercase tracking-widest text-white/30">
                  No Cover Photo
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-1">
              <Info label="Status" value={build.status.replace("_", " ")} />
              <Info label="Featured" value={build.isFeatured ? "Yes" : "No"} />
              <Info label="Model" value={build.motorcycleModel} />
              <Info label="Year" value={build.yearModel} />
              <Info label="Concept" value={build.concept} />
              <Info label="Owner Email" value={build.ownerEmail} />
            </div>
          </div>

          <div className="space-y-4 p-4 sm:p-6">
            <Section title="Description" value={build.description} />
            <Section title="Engine Setup" value={build.engineSetup} />
            <Section title="CVT Setup" value={build.cvtSetup} />
            <Section title="Suspension Setup" value={build.suspensionSetup} />
            <Section title="Brake Setup" value={build.brakingSetup} />
            <Section title="Wheel Setup" value={build.wheelSetup} />
            <Section title="Other Notable Upgrades" value={build.accessories} />

            <GallerySection images={build.galleryImages} title={build.title} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GallerySection({
  images,
  title,
}: {
  images: AdminBuildRow["galleryImages"] | null | undefined;
  title: string;
}) {
  if (!images?.length) {
    return <Section title="Gallery Images" value={null} />;
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/4 p-4 sm:p-5">
      <h3 className="text-xs font-black uppercase tracking-widest text-white/50 sm:text-sm">
        Gallery Images
      </h3>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black"
          >
            <Image
              src={image.imageUrl}
              alt={`${title} gallery image ${index + 1}`}
              fill
              loading="lazy"
              quality={75}
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/4 p-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-white/40 sm:text-xs">
        {label}
      </p>

      <p className="mt-1 wrap-break-word text-sm font-bold capitalize text-white">
        {value || "—"}
      </p>
    </div>
  );
}

function Section({
  title,
  value,
}: {
  title: string;
  value: string | null | undefined;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/4 p-4 sm:p-5">
      <h3 className="text-xs font-black uppercase tracking-widest text-white/50 sm:text-sm">
        {title}
      </h3>

      <p className="mt-3 whitespace-pre-wrap wrap-break-word text-sm leading-7 text-white/75">
        {value || "—"}
      </p>
    </section>
  );
}
