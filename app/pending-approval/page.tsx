// app/pending-approval/page.tsx
import { USER_STATUSES } from "@/lib/constants/user";
import { getCurrentUser } from "@/lib/get-current-user";
import { SignOutButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function PendingApprovalPage() {

const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (user.status === USER_STATUSES.APPROVED) {
    redirect("/");
  }

  
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="max-w-xl rounded-3xl border border-white/10 bg-white/4 p-8 text-center shadow-2xl shadow-red-950/30">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-red-500">
          Account Pending
        </p>

        <h1 className="mt-4 text-4xl font-black uppercase">
          Waiting for Approval
        </h1>

        <p className="mt-4 text-white/60">
          Your Boys of ADV account has been created, but it still needs admin
          approval before you can access member features.
        </p>

        <div className="mt-8">
          <SignOutButton>
            <button className="-skew-x-12 bg-red-600 px-5 py-2 text-sm font-black uppercase text-white transition tracking-wide hover:bg-red-700">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>
    </main>
  );
}