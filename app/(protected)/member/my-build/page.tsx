import { MemberShell } from "@/components/member/member-shell";

export default function MyBuildPage() {
  return (
    <MemberShell
      title="My Build"
      description="Manage your Honda ADV build details, parts list, story, and featured build information."
    >
      <form className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Build Name" placeholder="ADV 160 Street Beast" />
          <Field label="Motorcycle Model" placeholder="Honda ADV 160" />
          <Field label="Year Model" placeholder="2024" />
          <Field label="Concept" placeholder="Circuit / Indo / Malaysian " />
        </div>

        <div>
          <label className="text-xs font-black uppercase tracking-widest text-white/50">
            Build Summary
          </label>
          <textarea
            rows={4}
            placeholder="Short summary of your setup..."
            className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-600"
          />
        </div>

        <div>
          <label className="text-xs font-black uppercase tracking-widest text-white/50">
            Modifications
          </label>
          <textarea
            rows={6}
            placeholder="Example: JVT Exhaust, RCB Suspension, RCB Brake System..."
            className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-600"
          />
        </div>

        <div>
          <label className="text-xs font-black uppercase tracking-widest text-white/50">
            Build History
          </label>
          <textarea
            rows={6}
            placeholder="Tell the story of your ADV build..."
            className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-600"
          />
        </div>

        <div className="rounded-2xl border border-dashed border-white/20 bg-black p-6 text-center">
          <p className="text-sm font-black uppercase text-white">
            Build Photos
          </p>
          <p className="mt-2 text-sm text-white/50">
            Upload support can be added later using UploadThing. Limit: 10
            photos.
          </p>
        </div>

        <button className="w-fit rounded-full bg-red-600 px-6 py-3 text-sm font-black uppercase text-white hover:bg-red-500">
          Save Build
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