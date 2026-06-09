"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { updateMyBuild } from "../actions";
import { AutoResizeTextarea } from "@/components/member/auto-resize-textarea";
import { BuildCoverUploader } from "@/components/member/build-cover-uploader";
import { BuildFeaturedSwitch } from "@/components/member/build-featured-switch";
import { BuildGalleryUploader } from "@/components/member/build-gallery-uploader";

type MyBuildFormProps = {
  build: {
    title: string | null;
    motorcycleModel: string | null;
    yearModel: string | null;
    concept: string | null;
    description: string | null;
    engineSetup: string | null;
    cvtSetup: string | null;
    suspensionSetup: string | null;
    brakingSetup: string | null;
    wheelSetup: string | null;
    accessories: string | null;
    coverImageUrl: string | null;
    status: string | null;
    isFeatured: boolean | null;
    galleryImages?: {
      id?: string;
      imageUrl: string;
      imageKey?: string | null;
      caption?: string | null;
    }[];
  } | null;
};

export function MyBuildForm({ build }: MyBuildFormProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateMyBuild(formData);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <form
      action={handleSubmit}
      className="grid gap-5 rounded-2xl border border-white/10 bg-white/4 p-6"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          name="title"
          label="Build Name"
          placeholder="ADV 160 Street Beast"
          defaultValue={build?.title ?? ""}
          required
        />

        <Field
          name="motorcycleModel"
          label="Motorcycle Model"
          placeholder="Honda ADV 160"
          defaultValue={build?.motorcycleModel ?? ""}
          required
        />

        <Field
          name="yearModel"
          label="Year Model"
          placeholder="2024"
          defaultValue={build?.yearModel ?? ""}
        />

        <Field
          name="concept"
          label="Concept"
          placeholder="Circuit / Indo / Malaysian"
          defaultValue={build?.concept ?? ""}
        />
      </div>

      <AutoResizeTextarea
        name="description"
        label="Build Description"
        defaultValue={build?.description ?? ""}
        placeholder="Short summary of your setup..."
      />

      <AutoResizeTextarea
        name="engineSetup"
        label="Engine Setup"
        defaultValue={build?.engineSetup ?? ""}
        placeholder="Example: MTRT 63mm block, cams, throttle body, injector..."
      />

      <AutoResizeTextarea
        name="cvtSetup"
        label="CVT Setup"
        defaultValue={build?.cvtSetup ?? ""}
        placeholder="Example: pulley, flyball grams, center spring, clutch spring..."
      />

      <AutoResizeTextarea
        name="suspensionSetup"
        label="Suspension Setup"
        defaultValue={build?.suspensionSetup ?? ""}
        placeholder="Example: RCB rear shock, front fork tuning..."
      />

      <AutoResizeTextarea
        name="brakingSetup"
        label="Braking Setup"
        defaultValue={build?.brakingSetup ?? ""}
        placeholder="Example: caliper, disc, brake hose, pads..."
      />

      <AutoResizeTextarea
        name="wheelSetup"
        label="Wheel / Tire Setup"
        defaultValue={build?.wheelSetup ?? ""}
        placeholder="Example: RCB mags, tire sizes, tire brand..."
      />

      <AutoResizeTextarea
        name="accessories"
        label="Accessories"
        defaultValue={build?.accessories ?? ""}
        placeholder="Example: box, lights, windshield, crash guard, phone mount..."
      />

      <div>
        <BuildCoverUploader defaultImageUrl={build?.coverImageUrl ?? ""} />
      </div>

      <div>
        <BuildGalleryUploader defaultImages={build?.galleryImages ?? []} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-black p-5">
        <p className="text-xs font-black uppercase tracking-widest text-white/50">
          Build Status
        </p>

        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/3 px-4 py-3">
            <label className="text-xs font-black uppercase tracking-widest text-white/50">
              Status
            </label>

            <select
              name="status"
              defaultValue={build?.status ?? "draft"}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm font-bold uppercase text-white outline-none focus:border-red-600"
            >
              <option value="draft">Draft</option>
              <option value="for_review">For Review</option>
            </select>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/3 px-4 py-3">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-white/50">
                Featured
              </p>

              <p className="mt-1 text-sm text-white/60">
                Show this build in featured sections.
              </p>
            </div>

            <BuildFeaturedSwitch defaultChecked={build?.isFeatured ?? false} />
          </div>
        </div>
      </div>

      <button
        disabled={isPending}
        className="w-fit -skew-x-12 bg-red-600 px-6 py-3 text-sm font-black uppercase text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Build"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  placeholder,
  defaultValue,
  required = false,
}: {
  name: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-black uppercase tracking-widest text-white/50">
        {label}
      </label>

      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-600"
      />
    </div>
  );
}
