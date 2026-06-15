import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

import { db } from "@/db/db";
import { partners } from "@/db/schema";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
  createAuditLog,
} from "@/src/features/audit/audit-service";
import { assertApprovedAdmin } from "@/src/features/shared/service-actor";
import { ServiceError } from "@/src/lib/errors/service-error";
import type { PartnerAuditSnapshot, UpdatePartnerInput } from "./partner-types";
import {
  partnerIdSchema,
  partnerUpdateDataSchema,
} from "./partner-validation";

const utapi = new UTApi();

const AUDITED_PARTNER_FIELDS = [
  "name",
  "category",
  "websiteUrl",
  "description",
  "status",
  "logoUrl",
  "logoKey",
] as const satisfies readonly (keyof PartnerAuditSnapshot)[];

function assertPartnerFound<T>(partner: T | undefined) {
  if (!partner) {
    throw new ServiceError("NOT_FOUND", "Partner not found.");
  }

  return partner;
}

function toAuditSnapshot(partner: PartnerAuditSnapshot): PartnerAuditSnapshot {
  return {
    name: partner.name,
    category: partner.category,
    websiteUrl: partner.websiteUrl,
    description: partner.description,
    status: partner.status,
    logoUrl: partner.logoUrl,
    logoKey: partner.logoKey,
  };
}

function getChangedFields(
  before: PartnerAuditSnapshot,
  after: PartnerAuditSnapshot,
) {
  return AUDITED_PARTNER_FIELDS.filter((field) => before[field] !== after[field]);
}

export const PartnerService = {
  async update(input: UpdatePartnerInput) {
    assertApprovedAdmin(input.actor);
    partnerIdSchema.parse(input.partnerId);
    const payload = partnerUpdateDataSchema.parse(input.data);

    const existingPartner = await db.query.partners.findFirst({
      where: eq(partners.id, input.partnerId),
    });

    const existing = assertPartnerFound(existingPartner);
    const before = toAuditSnapshot(existing);
    const finalLogoUrl = payload.logoUrl || existing.logoUrl;
    const finalLogoKey = payload.logoKey || existing.logoKey;

    const [partner] = await db
      .update(partners)
      .set({
        name: payload.name,
        category: payload.category || null,
        websiteUrl: payload.websiteUrl || null,
        description: payload.description || null,
        status: payload.status,
        logoUrl: finalLogoUrl,
        logoKey: finalLogoKey,
        updatedAt: new Date(),
      })
      .where(eq(partners.id, input.partnerId))
      .returning();

    const updatedPartner = assertPartnerFound(partner);

    if (
      payload.logoKey &&
      existing.logoKey &&
      payload.logoKey !== existing.logoKey
    ) {
      await utapi.deleteFiles(existing.logoKey);
    }

    const after = toAuditSnapshot(updatedPartner);
    const changedFields = getChangedFields(before, after);

    await createAuditLog({
      actorId: input.actor.id,
      action: AUDIT_ACTIONS.PARTNER_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.PARTNER,
      entityId: updatedPartner.id,
      metadata: {
        before,
        after,
        changedFields,
        logoChanged:
          before.logoUrl !== after.logoUrl || before.logoKey !== after.logoKey,
      },
    });

    return {
      success: true,
      partner: updatedPartner,
    };
  },
};
