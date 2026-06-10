import { USER_STATUSES } from "@/lib/constants/user";
import { getCurrentDbUser } from "@/lib/current-user";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PendingApprovalPage() {
  const user = await getCurrentDbUser();

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

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
          <p className="text-sm font-black uppercase tracking-wider text-red-500">
            Need Assistance?
          </p>

          <p className="mt-2 text-sm text-white/70">
            If your approval is taking longer than expected, you can message
            <a
              href="https://www.facebook.com/papichulomotovlog"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold  tracking-widest text-red-600"
            >
              {" "}
              PAPiCHULO{" "}
            </a>
            or
            <a
              href="https://www.facebook.com/profile.php?id=61576342027040"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold  tracking-widest text-red-600"
            >
              {" "}
              Pulang ADV{" "}
            </a>
            on Facebook.
          </p>
        </div>

        <div className="mt-8 flex justify-between gap-4">
          <Link
            href={"/"}
            className="-skew-x-12 bg-red-600 px-5 py-2 border-none text-sm font-black uppercase text-white transition tracking-wide hover:bg-red-700"
          >
            Return to Home
          </Link>
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
