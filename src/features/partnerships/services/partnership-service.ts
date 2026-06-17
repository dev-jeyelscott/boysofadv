import { and, desc, eq, ilike, or } from "drizzle-orm";
import { nanoid } from "nanoid";

import { db } from "@/db/db";
import { partnerInquiries, partners } from "@/db/schema";
import { assertApprovedAdmin } from "@/src/features/shared/service-actor";
import type { ServiceActor } from "@/src/features/shared/service-actor";
import { revalidatePartnerCaches } from "@/src/lib/cache/revalidate";
import { ServiceError } from "@/src/lib/errors/service-error";
import {
  PARTNER_INQUIRY_STATUSES,
  partnerInquiryCreateSchema,
  partnerInquiryIdSchema,
  type CreatePartnerInquiryInput,
  type PartnerInquiryStatus,
} from "../partnership-validation";

type GetPartnerInquiriesFilters = {
  search?: string;
  status?: string;
};

const allowedTransitions = {
  new: ["contacted", "rejected"],
  contacted: ["approved", "rejected"],
  approved: [],
  rejected: [],
} as const satisfies Record<
  PartnerInquiryStatus,
  readonly PartnerInquiryStatus[]
>;

type PartnerInquiryRow = typeof partnerInquiries.$inferSelect;

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isPartnerInquiryStatus(
  status: string,
): status is PartnerInquiryStatus {
  return PARTNER_INQUIRY_STATUSES.includes(status as PartnerInquiryStatus);
}

function assertInquiryFound(inquiry: PartnerInquiryRow | undefined) {
  if (!inquiry) {
    throw new ServiceError("NOT_FOUND", "Partner inquiry not found.");
  }

  return inquiry;
}

function assertTransitionAllowed(
  currentStatus: PartnerInquiryStatus,
  nextStatus: PartnerInquiryStatus,
) {
  if (
    !allowedTransitions[currentStatus].some((status) => status === nextStatus)
  ) {
    throw new ServiceError(
      "INVALID_STATE",
      `Cannot change partner inquiry from ${currentStatus} to ${nextStatus}.`,
    );
  }
}

async function updatePartnerInquiryStatus(
  id: string,
  actor: ServiceActor,
  nextStatus: PartnerInquiryStatus,
) {
  assertApprovedAdmin(actor);
  partnerInquiryIdSchema.parse(id);

  const now = new Date();

  return db.transaction(async (tx) => {
    const existing = assertInquiryFound(
      await tx.query.partnerInquiries.findFirst({
        where: eq(partnerInquiries.id, id),
      }),
    );

    assertTransitionAllowed(existing.status, nextStatus);

    const timestampUpdates = {
      contactedAt: nextStatus === "contacted" ? now : existing.contactedAt,
      approvedAt: nextStatus === "approved" ? now : existing.approvedAt,
      rejectedAt: nextStatus === "rejected" ? now : existing.rejectedAt,
    };

    const [updatedInquiry] = await tx
      .update(partnerInquiries)
      .set({
        status: nextStatus,
        updatedAt: now,
        ...timestampUpdates,
      })
      .where(eq(partnerInquiries.id, id))
      .returning();

    const inquiry = assertInquiryFound(updatedInquiry);

    if (nextStatus === "approved") {
      const baseSlug = generateSlug(inquiry.businessName);

      await tx.insert(partners).values({
        id: nanoid(),
        name: inquiry.businessName,
        slug: `${baseSlug}-${nanoid(6)}`,
        email: inquiry.email,
        phoneNumber: inquiry.phoneNumber,
        websiteUrl: inquiry.websiteUrl,
        facebookUrl: inquiry.facebookUrl,
        description: inquiry.message,
        status: "active",
        isOfficial: true,
        updatedAt: now,
      });
    }

    return inquiry;
  });
}

export const PartnershipService = {
  async createPartnerInquiry(input: CreatePartnerInquiryInput) {
    const payload = partnerInquiryCreateSchema.parse(input);
    const now = new Date();

    const [inquiry] = await db
      .insert(partnerInquiries)
      .values({
        id: nanoid(),
        ...payload,
        status: "new",
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return assertInquiryFound(inquiry);
  },

  async getPartnerInquiries(filters: GetPartnerInquiriesFilters = {}) {
    const conditions = [];
    const search = filters.search?.trim();

    if (search) {
      conditions.push(
        or(
          ilike(partnerInquiries.businessName, `%${search}%`),
          ilike(partnerInquiries.contactName, `%${search}%`),
        ),
      );
    }

    if (
      filters.status &&
      filters.status !== "all" &&
      isPartnerInquiryStatus(filters.status)
    ) {
      conditions.push(eq(partnerInquiries.status, filters.status));
    }

    return db
      .select()
      .from(partnerInquiries)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(partnerInquiries.createdAt), desc(partnerInquiries.id));
  },

  async getPartnerInquiryById(id: string) {
    partnerInquiryIdSchema.parse(id);

    return assertInquiryFound(
      await db.query.partnerInquiries.findFirst({
        where: eq(partnerInquiries.id, id),
      }),
    );
  },

  async markPartnerInquiryAsContacted(id: string, actor: ServiceActor) {
    return updatePartnerInquiryStatus(id, actor, "contacted");
  },

  async approvePartnerInquiry(id: string, actor: ServiceActor) {
    const inquiry = await updatePartnerInquiryStatus(id, actor, "approved");
    revalidatePartnerCaches();
    return inquiry;
  },

  async rejectPartnerInquiry(id: string, actor: ServiceActor) {
    return updatePartnerInquiryStatus(id, actor, "rejected");
  },
};
