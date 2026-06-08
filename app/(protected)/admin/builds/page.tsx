import AdminPageShell from "@/components/admin/admin-page-shell";

const builds = [
  {
    title: "ADV 160 Street Beast",
    owner: "Juan Dela Cruz",
    model: "Honda ADV 160",
    status: "published",
    featured: true,
  },
  {
    title: "Urban Warrior",
    owner: "Mark Anthony",
    model: "Honda ADV 160",
    status: "draft",
    featured: false,
  },
];

export default function BuildsPage() {
  return (
    <AdminPageShell
      title="Builds"
      description="Manage community motorcycle builds and featured machines."
    >
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            placeholder="Search builds..."
            className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
          />

          <button className="rounded-full bg-red-600 px-5 py-3 text-sm font-black uppercase text-white hover:bg-red-500">
            Add Build
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {builds.map((build) => (
            <div
              key={build.title}
              className="overflow-hidden rounded-2xl border border-white/10 bg-black/40"
            >
              <div className="aspect-square bg-gradient-to-br from-neutral-900 via-black to-red-950" />

              <div className="p-5">
                <h3 className="text-lg font-black uppercase text-white">
                  {build.title}
                </h3>

                <p className="mt-1 text-sm text-white/50">{build.owner}</p>
                <p className="mt-1 text-sm text-white/50">{build.model}</p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase text-white/60">
                    {build.status}
                  </span>

                  {build.featured && (
                    <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-black uppercase text-white">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminPageShell>
  );
}
