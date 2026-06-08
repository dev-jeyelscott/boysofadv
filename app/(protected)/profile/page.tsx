import { requireApprovedUser } from "@/lib/auth/require-approved-user";

export default async function ProfilePage() {
  const user = await requireApprovedUser();

  return (
    <main className="min-h-screen bg-black px-4 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-black uppercase">
          Welcome, {user.firstName ?? "Member"}
        </h1>

        <p className="mt-2 text-white/60">
          You can now customize your Boys of ADV profile.
        </p>
      </div>
    </main>
  );
}