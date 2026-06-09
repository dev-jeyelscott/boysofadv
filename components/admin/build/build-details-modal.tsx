"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { AdminBuildRow } from "@/lib/constants/build";

type Props = {
  build: AdminBuildRow | null;
  onClose: () => void;
};

export function BuildDetailsDialog({ build, onClose }: Props) {
  if (!build) return null;

  const ownerName =
    build.ownerNickname ||
    build.ownerCodename ||
    [build.ownerFirstName, build.ownerLastName].filter(Boolean).join(" ") ||
    build.ownerEmail;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 p-4 backdrop-blur">
      <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-2xl font-black uppercase">
              {build.title || "Untitled Build"}
            </h2>
            <p className="text-sm text-white/40">Owner: {ownerName}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-white hover:bg-white/10"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="grid flex-1 overflow-y-auto md:grid-cols-[420px_1fr]">
          <div className="border-b border-white/10 p-6 md:border-b-0 md:border-r md:border-white/10">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black">
              {build.coverImageUrl ? (
                <Image
                  src={build.coverImageUrl}
                  alt={build.title || "Build cover"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-sm uppercase text-white/30">
                  No Cover Photo
                </div>
              )}
            </div>

            <div className="mt-5 grid gap-3 text-sm">
              <Info label="Status" value={build.status.replace("_", " ")} />
              <Info label="Featured" value={build.isFeatured ? "Yes" : "No"} />
              <Info label="Model" value={build.motorcycleModel} />
              <Info label="Year" value={build.yearModel} />
              <Info label="Concept" value={build.concept} />
              <Info label="Owner Email" value={build.ownerEmail} />
            </div>
          </div>

          <div className="space-y-5 p-6">
            <Section title="Description" value={build.description} />
            <Section title="Engine Setup" value={build.engineSetup} />
            <Section title="CVT Setup" value={build.cvtSetup} />
            <Section title="Suspension Setup" value={build.suspensionSetup} />
            <Section title="Brake Setup" value={build.brakingSetup} />
            <Section title="Wheel Setup" value={build.wheelSetup} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/4 p-4">
      <p className="text-xs font-black uppercase tracking-widest text-white/40">
        {label}
      </p>
      <p className="mt-1 font-bold text-white">{value || "—"}</p>
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
    <section className="rounded-2xl border border-white/10 bg-white/4 p-5">
      <h3 className="text-sm font-black uppercase tracking-widest text-white/50">
        {title}
      </h3>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/75">
        {value || "—"}
      </p>
    </section>
  );
}
