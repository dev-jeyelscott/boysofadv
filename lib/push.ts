import webPush from "web-push";

const MISSING_VAPID_MESSAGE =
  "Missing required VAPID environment variables. Please configure VAPID_SUBJECT, NEXT_PUBLIC_VAPID_PUBLIC_KEY, and VAPID_PRIVATE_KEY. VAPID_SUBJECT must be a valid mailto: or HTTPS URL.";

let isConfigured = false;

function getVapidConfig() {
  const subject = process.env.VAPID_SUBJECT;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!subject || !publicKey || !privateKey) {
    return {
      ok: false as const,
      error: MISSING_VAPID_MESSAGE,
    };
  }

  if (!subject.startsWith("mailto:") && !subject.startsWith("https://")) {
    return {
      ok: false as const,
      error: "VAPID_SUBJECT must be a valid mailto: or HTTPS URL.",
    };
  }

  return {
    ok: true as const,
    subject,
    publicKey,
    privateKey,
  };
}

export function getWebPushClient() {
  const config = getVapidConfig();

  if (!config.ok) {
    return config;
  }

  if (!isConfigured) {
    webPush.setVapidDetails(
      config.subject,
      config.publicKey,
      config.privateKey,
    );
    isConfigured = true;
  }

  return {
    ok: true as const,
    client: webPush,
  };
}

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};
