import AdminPageShell from "@/components/admin/admin-page-shell";

export default function PartnershipPage() {
  return (
    <AdminPageShell
      title="Partnership"
      description="Manage partnership applications and business collaborations."
    >
      <section className="rounded-2xl border border-white/10 bg-white/4 p-6">
        <h2 className="text-xl font-black uppercase text-white">
          Partnership Form
        </h2>

        <form className="mt-6 grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Business Name" placeholder="JVT Performance" />
            <Field label="Contact Person" placeholder="Juan Dela Cruz" />
            <Field label="Email" placeholder="partner@email.com" />
            <Field label="Phone" placeholder="+63 900 000 0000" />
          </div>

          <Field label="Website / Facebook Page" placeholder="https://..." />

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-white/50">
              Partnership Type
            </label>

            <select className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none">
              <option>Sponsor</option>
              <option>Brand Partner</option>
              <option>Event Partner</option>
              <option>Media Partner</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-white/50">
              Business Description
            </label>

            <textarea
              rows={5}
              placeholder="Tell us about the business..."
              className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
            />
          </div>

          <button className="w-fit rounded-full bg-red-600 px-6 py-3 text-sm font-black uppercase text-white hover:bg-red-500">
            Submit Application
          </button>
        </form>
      </section>
    </AdminPageShell>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="text-xs font-black uppercase tracking-widest text-white/50">
        {label}
      </label>

      <input
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
      />
    </div>
  );
}
