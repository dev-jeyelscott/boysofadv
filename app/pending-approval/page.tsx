export default function PendingApprovalPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="max-w-lg rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
          Account Pending
        </p>

        <h1 className="mt-4 text-3xl font-black uppercase">
          Waiting for Approval
        </h1>

        <p className="mt-4 text-white/70">
          Your Boys of ADV account has been created. An admin needs to approve
          your profile before you can access member features.
        </p>
      </div>
    </main>
  );
}