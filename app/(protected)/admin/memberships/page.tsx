import { and, desc, eq, ne } from "drizzle-orm";

import { db } from "@/db/db";
import { users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import { approveMember, rejectMember } from "./actions";
import { USER_ROLES, USER_STATUSES } from "@/lib/constants/user";

export default async function AdminMembersPage() {
  await requireAdmin();

  const members = await db.query.users.findMany({
    where: and(
      ne(users.role, USER_ROLES.SUPER_ADMIN),
      eq(users.status, USER_STATUSES.FOR_APPROVAL)
    ),
    orderBy: desc(users.createdAt),
  });

  return (
    <main className="min-h-screen bg-black px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-red-500">
          Admin
        </p>

        <h1 className="mt-3 text-4xl font-black uppercase">
          Membership Approvals
        </h1>

        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/4 text-white/60">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-white/10">
                  <td className="px-5 py-4 font-bold">
                    {member.firstName} {member.lastName}
                  </td>

                  <td className="px-5 py-4 text-white/70">
                    {member.email}
                  </td>

                  <td className="px-5 py-4 uppercase text-white/60">
                    {member.role}
                  </td>

                  <td className="px-5 py-4 uppercase text-red-400">
                    {member.status}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      {member.status === "for_approval" && (
                        <form action={approveMember.bind(null, member.id)}>
                            <button className="-skew-x-12 bg-red-600 px-5 py-2 text-sm font-black uppercase text-white transition tracking-wide hover:bg-red-700">
                            Approve
                            </button>
                        </form>
                        )}

                      <form action={rejectMember.bind(null, member.id)}>
                        <button className="-skew-x-12 bg-none border border-white hover:bg-white/20 px-5 py-2 text-sm font-black uppercase text-white transition tracking-wide hover:border-red-700">
                          Reject
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}

              {members.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-white/50">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}