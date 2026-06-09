"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { UploadDropzone } from "@/lib/uploadthing";

type PartnerLogoUploaderProps = {
  defaultLogoUrl?: string | null;
  defaultLogoKey?: string | null;
  onChange?: (value: { logoUrl: string; logoKey: string }) => void;
};

export function PartnerLogoUploader({
  defaultLogoUrl,
  defaultLogoKey,
  onChange,
}: PartnerLogoUploaderProps) {
  const [logoUrl, setLogoUrl] = useState(defaultLogoUrl ?? "");
  const [logoKey, setLogoKey] = useState(defaultLogoKey ?? "");

  useEffect(() => {
    setLogoUrl(defaultLogoUrl ?? "");
    setLogoKey(defaultLogoKey ?? "");
  }, [defaultLogoUrl, defaultLogoKey]);

  function updateLogo(nextLogoUrl: string, nextLogoKey: string) {
    setLogoUrl(nextLogoUrl);
    setLogoKey(nextLogoKey);

    onChange?.({
      logoUrl: nextLogoUrl,
      logoKey: nextLogoKey,
    });
  }

  function removeLogo() {
    updateLogo("", "");
  }

  return (
    <div>
      <label className="text-xs font-black uppercase tracking-widest text-white/50">
        Partner Logo
      </label>

      <input type="hidden" name="logoUrl" value={logoUrl} />
      <input type="hidden" name="logoKey" value={logoKey} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="mt-3 rounded-2xl border border-dashed border-white/15 bg-black p-4">
          <UploadDropzone
            endpoint="partnerLogo"
            onClientUploadComplete={(res) => {
              const file = res?.[0];

              if (!file) return;

              const uploadedUrl = file.ufsUrl ?? file.url;
              const uploadedKey = file.key;

              if (!uploadedUrl || !uploadedKey) {
                alert("Upload completed, but file URL or key is missing.");
                return;
              }

              updateLogo(uploadedUrl, uploadedKey);
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

        {logoUrl ? (
          <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black">
            <div className="flex justify-center py-4">
              <Image
                src={logoUrl}
                alt="Partner logo"
                height={180}
                width={180}
                className="aspect-square rounded-xl object-contain"
              />
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/10 p-4">
              <p className="line-clamp-1 text-xs text-white/50">{logoUrl}</p>

              <button
                type="button"
                onClick={removeLogo}
                className="shrink-0 rounded-full border border-red-600/40 px-4 py-2 text-xs font-black uppercase text-red-500 hover:bg-red-600 hover:text-white"
              >
                Remove
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <p className="mt-2 text-xs text-white/40">
        Upload one partner logo. Recommended ratio: 1:1 PNG or WebP.
      </p>
    </div>
  );
}
