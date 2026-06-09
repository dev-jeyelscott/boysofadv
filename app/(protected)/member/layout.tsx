import { MemberSidebar } from "@/components/member/member-sidebar";
import { USER_STATUSES } from "@/lib/constants/user";
import { getCurrentDbUser } from "@/lib/current-user";
import { redirect } from "next/navigation";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentDbUser();
  console.log(user);
  if (!user) {
    redirect("/sign-in");
  }

  if (user.status === USER_STATUSES.FOR_APPROVAL) {
    redirect("/pending-approval");
  }
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex flex-col md:flex-row">
        <MemberSidebar />

        <section className="min-h-screen flex-1 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.18),transparent_30%),linear-gradient(to_bottom,#050505,#000)] p-4 md:p-8">
          {children}
        </section>
      </div>
    </main>
  );
}
