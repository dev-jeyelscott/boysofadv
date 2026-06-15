"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea";
import { updateProfile } from "../actions";

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
      action={handleSubmit}
      className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/30 sm:p-5 lg:p-6"
    >
      <div className="space-y-1">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
          Member Profile
        </p>
        <h2 className="text-xl font-black uppercase text-white sm:text-2xl">
          Rider Information
        </h2>
        <p className="text-sm leading-6 text-white/50">
          Keep your public Boys of ADV profile details updated.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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

      <div className="grid gap-4 border-t border-white/10 pt-5">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/70">
          Social Links
        </p>

        <Field
          name="facebookUrl"
          label="Facebook URL"
          defaultValue={user.facebookUrl ?? ""}
          placeholder="https://facebook.com/your-profile"
        />
        <Field
          name="instagramUrl"
          label="Instagram URL"
          defaultValue={user.instagramUrl ?? ""}
          placeholder="https://instagram.com/your-profile"
        />
        <Field
          name="youtubeUrl"
          label="Youtube URL"
          defaultValue={user.youtubeUrl ?? ""}
          placeholder="https://youtube.com/@your-channel"
        />
      </div>

      <div className="border-t border-white/10 pt-5">
        <AutoResizeTextarea
          label="Bio"
          name="bio"
          defaultValue={user.bio ?? ""}
        />
      </div>

      <div className="sticky bottom-0 -mx-4 border-t border-white/10 bg-black/90 p-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <button
          disabled={isPending}
          className="w-full -skew-x-12 rounded-sm bg-red-600 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
        >
          <span className="block skew-x-12">
            {isPending ? "Saving..." : "Save Profile"}
          </span>
        </button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div className="grid gap-2">
      <label
        htmlFor={name}
        className="text-xs font-black uppercase tracking-widest text-white/50"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-white/10 bg-black/70 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-red-600 focus:bg-black"
      />
    </div>
  );
}
