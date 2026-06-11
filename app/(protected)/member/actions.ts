"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { UTApi } from "uploadthing/server";

import { db } from "@/db/db";
import { builds, users, galleryImages } from "@/db/schema";
import { getCurrentUser } from "@/lib/get-current-user";
import { BUILD_STATUSES } from "@/lib/constants/build";

const utapi = new UTApi();

export async function updateProfile(formData: FormData) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized.",
      };
    }

    await db
      .update(users)
      .set({
        firstName: String(formData.get("firstName") || ""),
        lastName: String(formData.get("lastName") || ""),
        nickname: String(formData.get("nickname") || ""),
        codename: String(formData.get("codename") || ""),
        unit: String(formData.get("unit") || ""),
        chapter: String(formData.get("chapter") || ""),
        facebookUrl: String(formData.get("facebookUrl") || ""),
        instagramUrl: String(formData.get("instagramUrl") || ""),
        youtubeUrl: String(formData.get("youtubeUrl") || ""),
        bio: String(formData.get("bio") || ""),
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    revalidatePath("/member/profile");

    return {
      success: true,
      message: "Profile updated successfully.",
    };
  } catch {
    return {
      success: false,
      message: "Failed to update profile.",
    };
  }
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

type BuildStatus = (typeof BUILD_STATUSES)[keyof typeof BUILD_STATUSES];

function parseBuildStatus(value: FormDataEntryValue | null): BuildStatus {
  const status = String(value || BUILD_STATUSES.DRAFT);

  if (
    status === BUILD_STATUSES.DRAFT ||
    status === BUILD_STATUSES.FOR_REVIEW ||
    status === BUILD_STATUSES.PUBLISHED ||
    status === BUILD_STATUSES.UNPUBLISHED ||
    status === BUILD_STATUSES.ARCHIVED ||
    status === BUILD_STATUSES.REJECTED
  ) {
    return status;
  }

  return BUILD_STATUSES.DRAFT;
}

export async function updateMyBuild(formData: FormData) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized.",
      };
    }

    const existingBuild = await db.query.builds.findFirst({
      where: eq(builds.userId, user.id),
    });

    const title = String(formData.get("title") || "").trim();

    const incomingCoverImageUrl = String(formData.get("coverImageUrl") || "");
    const incomingCoverImageKey = String(formData.get("coverImageKey") || "");

    const hasNewImage =
      incomingCoverImageUrl.length > 0 && incomingCoverImageKey.length > 0;

    const coverImageUrl = hasNewImage
      ? incomingCoverImageUrl
      : existingBuild?.coverImageUrl || "";

    const coverImageKey = hasNewImage
      ? incomingCoverImageKey
      : existingBuild?.coverImageKey || "";

    const isFeatured = formData.get("isFeatured") === "true";
    const status = parseBuildStatus(formData.get("status"));

    const payload = {
      title,
      slug: createSlug(
        title || `${user.nickname || user.firstName || "member"}-build`,
      ),
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
      status,
      isFeatured,
      updatedAt: new Date(),
    };

    if (
      hasNewImage &&
      existingBuild?.coverImageKey &&
      existingBuild.coverImageKey !== incomingCoverImageKey
    ) {
      await utapi.deleteFiles(existingBuild.coverImageKey);
    }

    let buildId = existingBuild?.id;

    if (existingBuild) {
      await db
        .update(builds)
        .set(payload)
        .where(eq(builds.id, existingBuild.id));
    } else {
      buildId = nanoid();

      await db.insert(builds).values({
        id: buildId,
        userId: user.id,
        ...payload,
      });
    }

    if (!buildId) {
      return {
        success: false,
        message: "Failed to update build gallery.",
      };
    }

    const galleryImagesRaw = String(formData.get("galleryImages") || "[]");

    const buildImages = JSON.parse(galleryImagesRaw) as {
      id?: string;
      imageUrl: string;
      altText?: string | null;
      caption?: string | null;
    }[];

    await db.delete(galleryImages).where(eq(galleryImages.buildId, buildId));

    if (buildImages.length > 0) {
      await db.insert(galleryImages).values(
        buildImages.map((image, index) => ({
          id: image.id || nanoid(),
          buildId,
          userId: user.id,
          type: "build" as const,
          imageUrl: image.imageUrl,
          altText: image.altText || null,
          caption: image.caption || null,
          displayOrder: index,
        })),
      );
    }

    revalidatePath("/member/my-build");
    revalidatePath("/builds");

    return {
      success: true,
      message: "Build updated successfully.",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to update build details.",
    };
  }
}
