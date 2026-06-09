"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateProfile } from "../actions";
import { AutoResizeTextarea } from "@/components/member/auto-resize-textarea";

type ProfileFormProps = {
  user: {
    firstName: string | null;
    lastName: string | null;
    nickname: string | null;
    codename: string | null;
    unit: string | null;
    chapter: string | null;
    facebookUrl: string | null;
    instagramUrl: string | null;
    youtubeUrl: string | null;
    bio: string | null;
  };
};

export function ProfileForm({ user }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateProfile(formData);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <form
      className="grid gap-5 rounded-2xl border border-white/10 bg-white/4 p-6"
      action={handleSubmit}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          name="firstName"
          label="First Name"
          defaultValue={user.firstName ?? ""}
        />
        <Field
          name="lastName"
          label="Last Name"
          defaultValue={user.lastName ?? ""}
        />
        <Field
          name="nickname"
          label="Nickname"
          defaultValue={user.nickname ?? ""}
        />
        <Field
          name="codename"
          label="Codename"
          defaultValue={user.codename ?? ""}
        />
        <Field
          name="unit"
          label="Motorcycle Unit"
          defaultValue={user.unit ?? ""}
        />
        <Field
          name="chapter"
          label="Chapter"
          defaultValue={user.chapter ?? ""}
        />
      </div>

      <Field
        name="facebookUrl"
        label="Facebook URL"
        defaultValue={user.facebookUrl ?? ""}
      />
      <Field
        name="instagramUrl"
        label="Instagram URL"
        defaultValue={user.instagramUrl ?? ""}
      />
      <Field
        name="youtubeUrl"
        label="Youtube URL"
        defaultValue={user.youtubeUrl ?? ""}
      />

      <div>
        <AutoResizeTextarea
          label="Bio"
          name="bio"
          defaultValue={user.bio ?? ""}
        />
      </div>

      <button
        disabled={isPending}
        className="w-fit -skew-x-12 bg-red-600 px-6 py-3 text-sm font-black uppercase text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="text-xs font-black uppercase tracking-widest text-white/50">
        {label}
      </label>

      <input
        name={name}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-600"
      />
    </div>
  );
}
