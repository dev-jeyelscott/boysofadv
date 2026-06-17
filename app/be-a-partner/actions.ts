"use server";

import { sendPushNotificationToAllAdmins } from "@/lib/send-push-notification";
import { PartnershipService } from "@/src/features/partnerships/services/partnership-service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitPartnerInquiry(formData: FormData) {
  await PartnershipService.createPartnerInquiry({
    businessName: String(formData.get("businessName") || ""),
    contactName: String(formData.get("contactName") || ""),
    email: String(formData.get("email") || ""),
    phoneNumber: String(formData.get("phoneNumber") || ""),
    websiteUrl: String(formData.get("websiteUrl") || ""),
    facebookUrl: String(formData.get("facebookUrl") || ""),
    message: String(formData.get("message") || ""),
  });

  await sendPushNotificationToAllAdmins({
    title: "Partnership",
    body: `There's a new partnership inquiry for us. Check it out!`,
    url: "/admin/partnership",
  });

  revalidatePath("/be-a-partner");
  revalidatePath("/admin/partnership");
  redirect("/be-a-partner?submitted=true");
}
