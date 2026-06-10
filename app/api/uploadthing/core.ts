import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { getCurrentUser } from "@/lib/get-current-user";

const f = createUploadthing();

export const uploadRouter = {
  buildCoverImage: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = await getCurrentUser();

      if (!user?.id) {
        throw new UploadThingError("Unauthorized");
      }

      return {
        userId: user.id,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        userId: metadata.userId,
        url: file.ufsUrl,
        key: file.key,
        name: file.name,
      };
    }),
  partnerLogo: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = await getCurrentUser();

      if (!user?.id) {
        throw new UploadThingError("Unauthorized");
      }

      return {
        userId: user.id,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        userId: metadata.userId,
        url: file.ufsUrl,
        key: file.key,
        name: file.name,
      };
    }),
  buildGallery: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 6,
    },
  })
    .middleware(async () => {
      const user = await getCurrentUser();

      if (!user?.id) {
        throw new UploadThingError("Unauthorized");
      }

      return {
        userId: user.id,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        userId: metadata.userId,
        url: file.ufsUrl,
        key: file.key,
        name: file.name,
      };
    }),
  eventPoster: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = await getCurrentUser();

      if (!user?.id) {
        throw new UploadThingError("Unauthorized");
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        userId: metadata.userId,
        url: file.ufsUrl,
        key: file.key,
        name: file.name,
      };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
