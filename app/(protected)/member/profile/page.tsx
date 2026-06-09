import { MemberShell } from "@/components/member/member-shell";
import { getCurrentUser } from "@/lib/get-current-user";
import { ProfileForm } from "./profile-form";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return (
    <MemberShell
      title="Profile"
      description="Update your member identity, public profile details, and Boys of ADV codename."
    >
      <ProfileForm user={user} />
    </MemberShell>
  );
}
