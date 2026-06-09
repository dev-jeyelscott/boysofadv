import { MemberShell } from "@/components/member/member-shell";
import { db } from "@/db/db";
import { builds, galleryImages } from "@/db/schema";
import { MyBuildForm } from "./my-build-form";
import { redirect } from "next/navigation";
import { getCurrentDbUser } from "@/lib/current-user";
import { USER_STATUSES } from "@/lib/constants/user";
import { asc, eq } from "drizzle-orm";

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

  const buildImages = build
    ? await db.query.galleryImages.findMany({
        where: eq(galleryImages.buildId, build.id),
        orderBy: asc(galleryImages.displayOrder),
      })
    : [];

  return (
    <MemberShell
      title="My Build"
      description="Manage your Honda ADV build details, parts list, story, and featured build information."
    >
      <MyBuildForm
        build={
          build
            ? {
                ...build,
                galleryImages: buildImages.map((image) => ({
                  id: image.id,
                  imageUrl: image.imageUrl,
                  altText: image.altText,
                  caption: image.caption,
                })),
              }
            : null
        }
      />
    </MemberShell>
  );
}
