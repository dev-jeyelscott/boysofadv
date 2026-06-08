import { MemberShell } from "@/components/member/member-shell";

export default function ProfilePage() {
  return (
    <MemberShell
      title="Profile"
      description="Update your member identity, public profile details, and Boys of ADV codename."
    >
      <form className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="First Name" placeholder="Juan" />
          <Field label="Last Name" placeholder="Dela Cruz" />
          <Field label="Nickname" placeholder="ADV Rider" />
          <Field label="Codename" placeholder="Redline" />
        </div>

        <Field label="Facebook URL" placeholder="https://facebook.com/..." />
        <Field label="Instagram URL" placeholder="https://instagram.com/..." />

        <div>
          <label className="text-xs font-black uppercase tracking-widest text-white/50">
            Bio
          </label>
          <textarea
            rows={5}
            placeholder="Tell something about yourself..."
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
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-xs font-black uppercase tracking-widest text-white/50">
        {label}
      </label>
      <input
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-600"
      />
    </div>
  );
}