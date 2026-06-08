import AdminPageShell from "@/components/admin/admin-page-shell";

export default function DashboardPage() {
  return (
    <AdminPageShell
      title="Dashboard"
      description="Overview of members, builds, partners, and events."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Members" value="128" />
        <StatCard label="Pending Members" value="12" />
        <StatCard label="Featured Builds" value="8" />
        <StatCard label="Upcoming Events" value="3" />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <AdminPanel title="Recent Members">
          <ListItem title="Juan Dela Cruz" meta="ADV 160 • For approval" />
          <ListItem title="Mark Anthony" meta="ADV 150 • Approved" />
          <ListItem title="Carlo Reyes" meta="ADV 160 • Approved" />
        </AdminPanel>

        <AdminPanel title="Featured Builds">
          <ListItem title="ADV 160 Street Beast" meta="Juan Dela Cruz" />
          <ListItem title="Urban Warrior" meta="Mark Anthony" />
          <ListItem title="Touring Machine" meta="Carlo Reyes" />
        </AdminPanel>
      </div>
    </AdminPageShell>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs font-black uppercase tracking-widest text-white/50">
        {label}
      </p>
      <h2 className="mt-3 text-4xl font-black text-white">{value}</h2>
    </div>
  );
}

function AdminPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <h2 className="text-xl font-black uppercase text-white">{title}</h2>
      <div className="mt-5 grid gap-3">{children}</div>
    </section>
  );
}

function ListItem({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-4">
      <p className="font-black text-white">{title}</p>
      <p className="mt-1 text-sm text-white/50">{meta}</p>
    </div>
  );
}
