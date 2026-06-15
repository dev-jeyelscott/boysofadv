"use server";

import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { z } from "zod";

import { db } from "@/db/db";
import { partners } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import { PartnerService } from "@/src/features/partners/partner-service";

const PARTNER_STATUSES = ["draft", "active", "inactive"] as const;

const createPartnerSchema = z.object({
  name: z.string().min(1, "Partner name is required"),
  category: z.string().optional(),
  logoUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  facebookUrl: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(PARTNER_STATUSES).default("draft"),
  isOfficial: z.boolean().default(false),
});

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createPartner(formData: FormData) {
  const rawData = {
    name: String(formData.get("name") || ""),
    category: String(formData.get("category") || ""),
    logoUrl: String(formData.get("logoUrl") || ""),
    websiteUrl: String(formData.get("websiteUrl") || ""),
    facebookUrl: String(formData.get("facebookUrl") || ""),
    description: String(formData.get("description") || ""),
    status: String(formData.get("status") || "draft"),
    isOfficial: formData.get("isOfficial") === "on",
  };

  const validated = createPartnerSchema.parse(rawData);

  const baseSlug = generateSlug(validated.name);
  const slug = `${baseSlug}-${nanoid(6)}`;

  await db.insert(partners).values({
    id: nanoid(),
    name: validated.name,
    slug,
    category: validated.category || null,
    logoUrl: validated.logoUrl || null,
    websiteUrl: validated.websiteUrl || null,
    facebookUrl: validated.facebookUrl || null,
    description: validated.description || null,
    status: validated.status,
    isOfficial: validated.isOfficial,
    updatedAt: new Date(),
  });

  revalidatePath("/admin/partners");
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(formData: FormData, key: string) {
  const value = getString(formData, key);
  return value || null;
}

function getPartnerUpdateData(formData: FormData) {
  return {
    name: getString(formData, "name"),
    category: getOptionalString(formData, "category"),
    websiteUrl: getOptionalString(formData, "websiteUrl"),
    description: getOptionalString(formData, "description"),
    status: getString(formData, "status") || "inactive",
    logoUrl: getOptionalString(formData, "logoUrl"),
    logoKey: getOptionalString(formData, "logoKey"),
  };
}

export async function updatePartner(id: string, formData: FormData) {
  const actor = await requireAdmin();

  await PartnerService.update({
    partnerId: id,
    actor,
    data: getPartnerUpdateData(formData),
  });

  revalidatePath("/admin/partners");
}
