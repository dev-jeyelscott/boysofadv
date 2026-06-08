import AdminPageShell from "@/components/admin/admin-page-shell";

const partners = [
  {
    name: "JVT Performance",
    category: "Performance Parts",
    status: "active",
  },
  {
    name: "RCB Philippines",
    category: "Suspension / Brakes",
    status: "featured",
  },
];

export default function PartnersPage() {
  return (
    <AdminPageShell
      title="Partners"
      description="Manage official partner brands and shops."
    >
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-black uppercase text-white">
            Partner Directory
          </h2>

          <button className="rounded-full bg-red-600 px-5 py-3 text-sm font-black uppercase text-white hover:bg-red-500">
            Add Partner
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="rounded-2xl border border-white/10 bg-black/40 p-5"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-red-600/20 text-xl font-black text-red-400">
                {partner.name.charAt(0)}
              </div>

              <h3 className="mt-4 text-lg font-black uppercase text-white">
                {partner.name}
              </h3>

              <p className="mt-1 text-sm text-white/50">{partner.category}</p>

              <span className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase text-white/60">
                {partner.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </AdminPageShell>
  );
}
