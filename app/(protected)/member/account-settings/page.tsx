import { MemberShell } from "@/components/member/member-shell";

export default function AccountSettingsPage() {
  return (
    <MemberShell
      title="Account Settings"
      description="Manage your account preferences and basic member visibility settings."
    >
      <div className="grid gap-5">
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-black uppercase text-white">
            Account Information
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field label="Email" placeholder="member@email.com" />
            <Field label="Display Name" placeholder="ADV Rider" />
          </div>

          <button className="mt-6 rounded-full bg-red-600 px-6 py-3 text-sm font-black uppercase text-white hover:bg-red-500">
            Save Changes
          </button>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-black uppercase text-white">
            Visibility
          </h2>

          <div className="mt-5 space-y-4">
            <Toggle label="Show my profile publicly" />
            <Toggle label="Allow my build to appear in featured builds" />
            <Toggle label="Show my social media links" />
          </div>
        </section>
      </div>
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

function Toggle({ label }: { label: string }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black px-4 py-3">
      <span className="text-sm font-bold text-white/70">{label}</span>
      <input type="checkbox" className="h-5 w-5 accent-red-600" />
    </label>
  );
}