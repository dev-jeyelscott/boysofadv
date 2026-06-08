"use client";

import Image from "next/image";
import { useState } from "react";

import { UploadDropzone } from "@/lib/uploadthing";

type BuildCoverUploaderProps = {
  defaultValue?: string;
};

export function BuildCoverUploader({ defaultValue = "" }: BuildCoverUploaderProps) {
  const [coverImageUrl, setCoverImageUrl] = useState(defaultValue);
  const [coverImageKey, setCoverImageKey] = useState(defaultValue);

  return (
    <div>
      <label className="text-xs font-black uppercase tracking-widest text-white/50">
        Cover Image
      </label>

      <input type="hidden" name="coverImageUrl" value={coverImageUrl} />
      <input type="hidden" name="coverImageKey" value={coverImageKey} />
      <div className="grid grid-cols-2 gap-4">
        <div className="mt-3 rounded-2xl border border-dashed border-white/15 bg-black p-4">
          <UploadDropzone
            endpoint="buildCoverImage"
            onClientUploadComplete={(res) => {
              const file = res?.[0];

              if (!file) return;

              setCoverImageUrl(file.ufsUrl);
              setCoverImageKey(file.key);

            }}
            onUploadError={(error) => {
              console.error(error);
              alert(error.message);
            }}
            appearance={{
              container:
                "border-0 bg-transparent p-0 text-white ut-label:text-white ut-allowed-content:text-white/40",
              button:
                "bg-red-600 text-white font-black px-6 py-2 -skew-x-12 text-sm uppercase hover:bg-red-500 after:bg-red-700",
              uploadIcon: "text-red-500",
            }}
          />
        </div>
        {coverImageUrl ? (
          <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black">
            <div className="flex justify-center py-4">
              <Image
                src={coverImageUrl}
                alt="Build cover image"
                height={250}
                width={250}
                className="object-cover"
              />
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/10 p-4">
              <p className="line-clamp-1 text-xs text-white/50">
                {coverImageUrl}
              </p>

              <button
                type="button"
                onClick={() => setCoverImageUrl("")}
                className="shrink-0 rounded-full border border-red-600/40 px-4 py-2 text-xs font-black uppercase text-red-500 hover:bg-red-600 hover:text-white"
              >
                Remove
              </button>
            </div>
          </div>
        ) : null}
      </div>
      

      <p className="mt-2 text-xs text-white/40">
        Upload one cover image. Recommended ratio: 16:9.
      </p>
    </div>
  );
}