import { eq } from "drizzle-orm";

import { MemberShell } from "@/components/member/member-shell";
import { db } from "@/db/db";
import { builds } from "@/db/schema";
import { MyBuildForm } from "./my-build-form";
import { redirect } from "next/navigation";
import { getCurrentDbUser } from "@/lib/current-user";
import { USER_STATUSES } from "@/lib/constants/user";

export default async function MyBuildPage() {
  const user = await getCurrentDbUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (user.status === USER_STATUSES.FOR_APPROVAL) {
    redirect("/pending-approval");
  }

  const build = await db.query.builds.findFirst({
    where: eq(builds.userId, user.id),
  });

  return (
    <MemberShell
      title="My Build"
      description="Manage your Honda ADV build details, parts list, story, and featured build information."
    >
      <MyBuildForm build={build ?? null} />
    </MemberShell>
  );
}
