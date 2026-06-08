import AdminPageShell from "@/components/admin/admin-page-shell";
import StatusBadge from "@/components/admin/status-badge";

const members = [
  {
    name: "Juan Dela Cruz",
    codename: "ADV Beast",
    email: "juan@email.com",
    role: "member",
    status: "for_approval",
  },
  {
    name: "Mark Anthony",
    codename: "Urban Rider",
    email: "mark@email.com",
    role: "member",
    status: "approved",
  },
];

export default function MembersPage() {
  return (
    <AdminPageShell
      title="Members"
      description="Manage Boys of ADV member approvals and roles."
    >
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            placeholder="Search members..."
            className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
          />

          <button className="rounded-full bg-red-600 px-5 py-3 text-sm font-black uppercase text-white hover:bg-red-500">
            Add Member
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.06] text-xs uppercase text-white/50">
              <tr>
                <th className="p-4">Member</th>
                <th className="p-4">Codename</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member) => (
                <tr key={member.email} className="border-t border-white/10">
                  <td className="p-4 font-bold text-white">{member.name}</td>
                  <td className="p-4 text-white/60">{member.codename}</td>
                  <td className="p-4 text-white/60">{member.email}</td>
                  <td className="p-4 text-white/60">{member.role}</td>
                  <td className="p-4">
                    <StatusBadge status={member.status} />
                  </td>
                  <td className="p-4 text-right">
                    <button className="rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase text-white hover:bg-white/10">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminPageShell>
  );
}
