import { nanoid } from "nanoid";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { sendPushNotificationToAllAdmins } from "@/lib/send-push-notification";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type !== "user.created") {
      return Response.json({ received: true });
    }

    const user = evt.data;

    let role: "member" | "admin" | "super_admin" = "member";
    let status: "for_approval" | "approved" | "rejected" | "suspended" =
      "for_approval";

    if (
      user.email_addresses?.[0]?.email_address === process.env.SUPER_ADMIN_EMAIL
    ) {
      role = "super_admin";
      status = "approved";
    }

    await db.insert(users).values({
      id: nanoid(),
      clerkUserId: user.id,
      email: user.email_addresses[0].email_address,
      firstName: user.first_name,
      lastName: user.last_name,
      role: role,
      status: status,
    });

    const nameOrEmail =
      user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : user.email_addresses[0].email_address;

    await sendPushNotificationToAllAdmins({
      title: "New Member Registration",
      body: `${nameOrEmail} submitted a membership application.`,
      url: "/admin/members",
    });

    return Response.json({ received: true });
  } catch (error) {
    console.error("Clerk webhook error:", error);
    return new Response("Webhook verification failed", { status: 400 });
  }
}
