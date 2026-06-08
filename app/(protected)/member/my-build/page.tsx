import { eq } from "drizzle-orm";

import { MemberShell } from "@/components/member/member-shell";
import { db } from "@/db/db";
import { builds } from "@/db/schema";
import { getCurrentUser } from "@/lib/get-current-user";
import { MyBuildForm } from "./my-build-form";

export default async function MyBuildPage() {
  const user = await getCurrentUser();

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
