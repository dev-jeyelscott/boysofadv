import { MemberShell } from "@/components/member/member-shell";
import { updateProfile } from "../actions";
import { getCurrentUser } from "@/lib/get-current-user";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <MemberShell
      title="Profile"
      description="Update your member identity, public profile details, and Boys of ADV codename."
    >
      <form className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6" action={updateProfile}>
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

        <div>
          <label className="text-xs font-black uppercase tracking-widest text-white/50">
            Bio
          </label>

          <textarea
            name="bio"
            rows={5}
            defaultValue={user.bio ?? ""}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-600"
          />
        </div>

        <button className="w-fit rounded-full bg-red-600 px-6 py-3 text-sm font-black uppercase text-white hover:bg-red-500">
          Save Profile
        </button>
      </form>
    </MemberShell>
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