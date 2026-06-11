import webPush from "web-push";

const VAPID_SUBJECT = process.env.VAPID_SUBJECT;
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

if (!VAPID_SUBJECT || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  throw new Error(
    "Missing required VAPID environment variables. Please configure VAPID_SUBJECT, NEXT_PUBLIC_VAPID_PUBLIC_KEY, and VAPID_PRIVATE_KEY. VAPID_SUBJECT must be a valid mailto: or HTTPS URL.",
  );
}

if (
  !VAPID_SUBJECT.startsWith("mailto:") &&
  !VAPID_SUBJECT.startsWith("https://")
) {
  throw new Error("VAPID_SUBJECT must be a valid mailto: or HTTPS URL.");
}

webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export { webPush };

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};
