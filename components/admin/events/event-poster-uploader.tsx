"use client";

import Image from "next/image";
import { useState } from "react";

import { UploadButton } from "@/lib/uploadthing";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";

type Props = {
  defaultImageUrl?: string | null;
  defaultImageKey?: string | null;
};

export function EventPosterUploader({
  defaultImageUrl,
  defaultImageKey,
}: Props) {
  const [posterImageUrl, setPosterImageUrl] = useState(defaultImageUrl ?? "");
  const [posterImageKey, setPosterImageKey] = useState(defaultImageKey ?? "");

  return (
    <div className="space-y-3">
      <input type="hidden" name="posterImageUrl" value={posterImageUrl} />
      <input type="hidden" name="posterImageKey" value={posterImageKey} />

      <label className="text-xs font-black uppercase tracking-widest text-white/50">
        Event Poster
      </label>

      {posterImageUrl ? (
        <div className="flex justify-center">
          <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black">
            <Image
              src={posterImageUrl}
              alt="Event poster"
              fill
              sizes="600px"
              className="object-contain"
            />
          </div>
        </div>
      ) : null}

      <UploadButton
        endpoint="eventPoster"
        onBeforeUploadBegin={async (files) => {
          return await Promise.all(
            files.map((file) =>
              imageCompression(file, {
                maxSizeMB: 0.4,
                maxWidthOrHeight: 800,
                useWebWorker: true,
                fileType: "image/webp",
              }),
            ),
          );
        }}
        onClientUploadComplete={(res) => {
          const file = res?.[0];

          if (!file) return;

          setPosterImageUrl(file.url);
          setPosterImageKey(file.key);
        }}
        onUploadError={(error) => {
          console.log(error);
          toast.error(error.message);
        }}
        className="rounded-2xl border-white/10 bg-black/40 text-white ut-label:text-white ut-button:bg-red-600 ut-button:text-white ut-button:hover:bg-red-500"
      />
    </div>
  );
}
