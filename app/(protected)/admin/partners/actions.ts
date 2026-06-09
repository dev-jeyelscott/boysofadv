"use server";

import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { z } from "zod";

import { db } from "@/db/db";
import { partners } from "@/db/schema";
import { UTApi } from "uploadthing/server";
import { eq } from "drizzle-orm";

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

const utapi = new UTApi();

export async function updatePartner(id: string, formData: FormData) {
  const existingPartner = await db.query.partners.findFirst({
    where: eq(partners.id, id),
  });

  if (!existingPartner) {
    throw new Error("Partner not found.");
  }

  const logoUrl = String(formData.get("logoUrl") || "");
  const logoKey = String(formData.get("logoKey") || "");

  const finalLogoUrl = logoUrl || existingPartner.logoUrl;
  const finalLogoKey = logoKey || existingPartner.logoKey;

  await db
    .update(partners)
    .set({
      name: String(formData.get("name") || ""),
      category: String(formData.get("category") || "") || null,
      websiteUrl: String(formData.get("websiteUrl") || "") || null,
      description: String(formData.get("description") || "") || null,
      status: String(formData.get("status") || "inactive") as
        | "active"
        | "inactive",
      logoUrl: finalLogoUrl,
      logoKey: finalLogoKey,
      updatedAt: new Date(),
    })
    .where(eq(partners.id, id));

  if (
    logoKey &&
    existingPartner.logoKey &&
    logoKey !== existingPartner.logoKey
  ) {
    await utapi.deleteFiles(existingPartner.logoKey);
  }

  revalidatePath("/admin/partners");
}
