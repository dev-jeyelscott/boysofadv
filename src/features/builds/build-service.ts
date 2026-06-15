import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/db/db";
import { builds } from "@/db/schema";
import { BUILD_STATUSES } from "@/lib/constants/build";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
  createAuditLog,
} from "@/src/features/audit/audit-service";
import { NotificationService } from "@/src/features/notifications/notification-service";
import { assertApprovedAdmin } from "@/src/features/shared/service-actor";
import { ServiceError } from "@/src/lib/errors/service-error";
import type { BuildTransitionInput, RejectBuildInput } from "./build-types";
import { buildIdSchema, rejectBuildSchema } from "./build-validation";

function assertBuildFound<T>(build: T | undefined) {
  if (!build) {
    throw new ServiceError("NOT_FOUND", "Build not found.");
  }

  return build;
}

export const BuildService = {
  async submitForReview(input: BuildTransitionInput) {
    buildIdSchema.parse(input.buildId);

    const now = new Date();
    const existingBuild = await db.query.builds.findFirst({
      where: eq(builds.id, input.buildId),
    });

    const currentBuild = assertBuildFound(existingBuild);

    const [build] = await db
      .update(builds)
      .set({
        status: BUILD_STATUSES.FOR_REVIEW,
        submittedAt: now,
        rejectionReason: null,
        updatedAt: now,
      })
      .where(
        and(
          eq(builds.id, input.buildId),
          inArray(builds.status, [
            BUILD_STATUSES.DRAFT,
            BUILD_STATUSES.REJECTED,
            BUILD_STATUSES.UNPUBLISHED,
          ]),
        ),
      )
      .returning();

    if (!build) {
      throw new ServiceError(
        "INVALID_STATE",
        "Only draft, rejected, or unpublished builds can be submitted.",
      );
    }

    await createAuditLog({
      actorId: input.actor.id,
      action: AUDIT_ACTIONS.BUILD_SUBMITTED,
      entityType: AUDIT_ENTITY_TYPES.BUILD,
      entityId: build.id,
      metadata: {
        ownerId: build.userId,
        slug: build.slug,
        previousStatus: currentBuild.status,
        newStatus: BUILD_STATUSES.FOR_REVIEW,
        submittedBy: input.actor.id,
        submittedAt: now,
      },
    });

    return {
      success: true,
      build,
    };
  },

  async publish(input: BuildTransitionInput) {
    assertApprovedAdmin(input.actor);
    buildIdSchema.parse(input.buildId);

    const now = new Date();
    const [build] = await db
      .update(builds)
      .set({
        status: BUILD_STATUSES.PUBLISHED,
        publishedAt: now,
        reviewedAt: now,
        reviewedBy: input.actor.id,
        updatedAt: now,
      })
      .where(
        and(
          eq(builds.id, input.buildId),
          eq(builds.status, BUILD_STATUSES.FOR_REVIEW),
        ),
      )
      .returning();

    if (!build) {
      const existing = await db.query.builds.findFirst({
        where: eq(builds.id, input.buildId),
      });

      assertBuildFound(existing);
      throw new ServiceError(
        "INVALID_STATE",
        "Only builds for review can be published.",
      );
    }

    await createAuditLog({
      actorId: input.actor.id,
      action: AUDIT_ACTIONS.BUILD_PUBLISHED,
      entityType: AUDIT_ENTITY_TYPES.BUILD,
      entityId: build.id,
      metadata: {
        previousStatus: BUILD_STATUSES.FOR_REVIEW,
        newStatus: BUILD_STATUSES.PUBLISHED,
        ownerId: build.userId,
        slug: build.slug,
        reviewedBy: input.actor.id,
        reviewedAt: now,
        publishedAt: now,
      },
    });

    const notificationSummary = await NotificationService.notifyBuildPublished({
      ownerId: build.userId,
      slug: build.slug,
    });

    return {
      success: true,
      build,
      notificationSummary,
    };
  },

  async reject(input: RejectBuildInput) {
    assertApprovedAdmin(input.actor);
    const payload = rejectBuildSchema.parse(input);

    const now = new Date();
    const [build] = await db
      .update(builds)
      .set({
        status: BUILD_STATUSES.REJECTED,
        reviewedAt: now,
        reviewedBy: input.actor.id,
        rejectionReason: payload.reason,
        updatedAt: now,
      })
      .where(
        and(
          eq(builds.id, payload.buildId),
          eq(builds.status, BUILD_STATUSES.FOR_REVIEW),
        ),
      )
      .returning();

    if (!build) {
      const existing = await db.query.builds.findFirst({
        where: eq(builds.id, payload.buildId),
      });

      assertBuildFound(existing);
      throw new ServiceError(
        "INVALID_STATE",
        "Only builds for review can be rejected.",
      );
    }

    await createAuditLog({
      actorId: input.actor.id,
      action: AUDIT_ACTIONS.BUILD_REJECTED,
      entityType: AUDIT_ENTITY_TYPES.BUILD,
      entityId: build.id,
      metadata: {
        previousStatus: BUILD_STATUSES.FOR_REVIEW,
        newStatus: BUILD_STATUSES.REJECTED,
        ownerId: build.userId,
        slug: build.slug,
        reviewedBy: input.actor.id,
        reviewedAt: now,
        reason: payload.reason,
      },
    });

    const notificationSummary = await NotificationService.notifyBuildRejected({
      ownerId: build.userId,
    });

    return {
      success: true,
      build,
      notificationSummary,
    };
  },

  async unpublish(input: BuildTransitionInput) {
    assertApprovedAdmin(input.actor);
    buildIdSchema.parse(input.buildId);

    const [build] = await db
      .update(builds)
      .set({
        status: BUILD_STATUSES.UNPUBLISHED,
        publishedAt: null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(builds.id, input.buildId),
          eq(builds.status, BUILD_STATUSES.PUBLISHED),
        ),
      )
      .returning();

    if (!build) {
      const existing = await db.query.builds.findFirst({
        where: eq(builds.id, input.buildId),
      });

      assertBuildFound(existing);
      throw new ServiceError(
        "INVALID_STATE",
        "Only published builds can be unpublished.",
      );
    }

    return {
      success: true,
      build,
    };
  },

  async archive(input: BuildTransitionInput) {
    assertApprovedAdmin(input.actor);
    buildIdSchema.parse(input.buildId);

    const [build] = await db
      .update(builds)
      .set({
        status: BUILD_STATUSES.ARCHIVED,
        updatedAt: new Date(),
      })
      .where(eq(builds.id, input.buildId))
      .returning();

    assertBuildFound(build);

    return {
      success: true,
      build,
    };
  },
};
