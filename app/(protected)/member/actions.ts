"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { UTApi } from "uploadthing/server";

import { db } from "@/db/db";
import { builds, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/get-current-user";

const utapi = new UTApi();

export async function updateProfile(formData: FormData) {
  const user = await getCurrentUser();

  await db
    .update(users)
    .set({
      firstName: String(formData.get("firstName") || ""),
      lastName: String(formData.get("lastName") || ""),
      nickname: String(formData.get("nickname") || ""),
      codename: String(formData.get("codename") || ""),
      facebookUrl: String(formData.get("facebookUrl") || ""),
      instagramUrl: String(formData.get("instagramUrl") || ""),
      bio: String(formData.get("bio") || ""),
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  revalidatePath("/member/profile");
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function updateMyBuild(formData: FormData) {
  const user = await getCurrentUser();

  const existingBuild = await db.query.builds.findFirst({
    where: eq(builds.userId, user.id),
  });

  const title = String(formData.get("title") || "").trim();

  const coverImageUrl = String(formData.get("coverImageUrl") || "");
  const coverImageKey = String(formData.get("coverImageKey") || "");

  const payload = {
    title,
    slug: createSlug(title || `${user.nickname || user.firstName || "member"}-build`),
    motorcycleModel: String(formData.get("motorcycleModel") || ""),
    yearModel: String(formData.get("yearModel") || ""),
    concept: String(formData.get("concept") || ""),
    description: String(formData.get("description") || ""),
    engineSetup: String(formData.get("engineSetup") || ""),
    cvtSetup: String(formData.get("cvtSetup") || ""),
    suspensionSetup: String(formData.get("suspensionSetup") || ""),
    brakingSetup: String(formData.get("brakingSetup") || ""),
    wheelSetup: String(formData.get("wheelSetup") || ""),
    accessories: String(formData.get("accessories") || ""),
    coverImageUrl,
    coverImageKey,
    updatedAt: new Date(),
  };

  if (
    existingBuild?.coverImageKey &&
    coverImageKey &&
    existingBuild.coverImageKey !== coverImageKey
  ) {
    await utapi.deleteFiles(existingBuild.coverImageKey);
  }

  if (existingBuild) {
    await db
      .update(builds)
      .set(payload)
      .where(eq(builds.id, existingBuild.id));
  } else {
    await db.insert(builds).values({
      id: nanoid(),
      userId: user.id,
      ...payload,
    });
  }

    revalidatePath("/member/my-build");
}


// export async function updateAccountSettings(formData: FormData) {
//   const user = await getCurrentMember();

//   await db
//     .update(users)
//     .set({
//       displayName: String(formData.get("displayName") || ""),
//       showProfilePublicly: formData.get("showProfilePublicly") === "on",
//       showBuildPublicly: formData.get("showBuildPublicly") === "on",
//       showSocialLinks: formData.get("showSocialLinks") === "on",
//       updatedAt: new Date(),
//     })
//     .where(eq(users.id, user.id));

//   revalidatePath("/member/account-settings");
// }