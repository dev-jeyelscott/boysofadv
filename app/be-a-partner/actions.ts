"use server";

import { db } from "@/db/db";
import { partnerInquiries } from "@/db/schema";
import { sendPushNotificationToAllAdmins } from "@/lib/send-push-notification";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitPartnerInquiry(formData: FormData) {
  const id = nanoid();

  await db.insert(partnerInquiries).values({
    id,
    businessName: String(formData.get("businessName") || ""),
    contactPerson: String(formData.get("contactPerson") || ""),
    email: String(formData.get("email") || ""),
    phoneNumber: String(formData.get("phoneNumber") || ""),
    websiteUrl: String(formData.get("websiteUrl") || ""),
    facebookUrl: String(formData.get("facebookUrl") || ""),
    message: String(formData.get("message") || ""),
    status: "new",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await sendPushNotificationToAllAdmins({
    title: "Partnership",
    body: `There's a new partnership inquiry for us. Check it out!`,
    url: "/admin/partnerships",
  });

  revalidatePath("/be-a-partner");
  redirect("/be-a-partner?submitted=true");
}
