"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useState } from "react";

import { UploadButton } from "@/lib/uploadthing";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";

type GalleryImage = {
  id?: string;
  imageUrl: string;
  imageKey?: string | null;
  caption?: string | null;
};

type Props = {
  defaultImages?: GalleryImage[];
};

export function BuildGalleryUploader({ defaultImages = [] }: Props) {
  const [images, setImages] = useState<GalleryImage[]>(defaultImages);

  function removeImage(imageUrl: string) {
    setImages((current) =>
      current.filter((image) => image.imageUrl !== imageUrl),
    );
  }

  function updateCaption(imageUrl: string, caption: string) {
    setImages((current) =>
      current.map((image) =>
        image.imageUrl === imageUrl ? { ...image, caption } : image,
      ),
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black p-5">
      <input
        type="hidden"
        name="galleryImages"
        value={JSON.stringify(images)}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-white/50">
            Build Gallery
          </p>
          <p className="mt-1 text-sm text-white/50">
            Upload extra photos for this build.
          </p>
        </div>

        <UploadButton
          endpoint="buildGallery"
          onBeforeUploadBegin={async (files) => {
            return await Promise.all(
              files.map((file) =>
                imageCompression(file, {
                  maxSizeMB: 1,
                  maxWidthOrHeight: 1920,
                  useWebWorker: true,
                  fileType: "image/webp",
                }),
              ),
            );
          }}
          onClientUploadComplete={(res) => {
            if (!res?.length) return;

            setImages((current) => [
              ...current,
              ...res.map((file) => ({
                imageUrl: file.url,
                imageKey: file.key,
                caption: "",
              })),
            ]);
          }}
          onUploadError={(error) => {
            console.log(error);
            toast.error(error.message);
          }}
          appearance={{
            container:
              "border-0 bg-transparent p-0 text-white ut-label:text-white ut-allowed-content:text-white/40",
            button:
              "bg-red-600 text-white font-black px-6 py-2 -skew-x-12 text-sm uppercase hover:bg-red-500 after:bg-red-700",
          }}
        />
      </div>

      {images.length > 0 ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <div
              key={image.imageUrl}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/4"
            >
              <div className="relative aspect-4/3 bg-neutral-900">
                <Image
                  src={image.imageUrl}
                  alt={image.caption || "Build gallery image"}
                  fill
                  loading="lazy"
                  quality={75}
                  className="object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeImage(image.imageUrl)}
                  className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white transition hover:bg-red-600"
                >
                  <Trash2 />
                </button>
              </div>

              <div className="p-3">
                <input
                  value={image.caption ?? ""}
                  onChange={(event) =>
                    updateCaption(image.imageUrl, event.target.value)
                  }
                  placeholder="Caption"
                  className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-600"
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
