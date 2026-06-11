// components/push-notification-modal.tsx
"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const REMIND_LATER_KEY = "push-remind-later-until";
const REMIND_LATER_MS = 12 * 60 * 60 * 1000;

type PushSubscriptionPayload = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

type PushApiResponse = {
  message?: string;
};

type PushStatusResponse = {
  enabled: boolean;
};

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = `${base64String}${padding}`
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

function isPushSupported() {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

async function getActiveServiceWorkerRegistration() {
  await navigator.serviceWorker.register("/sw.js");

  const registration = await navigator.serviceWorker.ready;

  if (!registration.active) {
    throw new Error("No active service worker.");
  }

  return registration;
}

function toPushSubscriptionPayload(
  subscription: PushSubscription,
): PushSubscriptionPayload {
  const subscriptionJson = subscription.toJSON();

  return {
    endpoint: subscriptionJson.endpoint ?? "",
    keys: {
      p256dh: subscriptionJson.keys?.p256dh ?? "",
      auth: subscriptionJson.keys?.auth ?? "",
    },
  };
}

async function savePushSubscription(subscription: PushSubscriptionPayload) {
  const response = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });

  const data = (await response.json().catch(() => ({}))) as PushApiResponse;

  return {
    success: response.ok,
    message: data.message ?? "Failed to save push subscription.",
  };
}

async function checkPushSubscriptionEnabled(endpoint: string) {
  const response = await fetch("/api/push-subscriptions/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ endpoint }),
  });

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as PushStatusResponse;

  return data.enabled;
}

export function PushNotificationModal() {
  const { isLoaded, isSignedIn } = useUser();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkShouldShowModal() {
      if (!isLoaded || !isSignedIn) {
        setOpen(false);
        return;
      }

      if (!isPushSupported()) {
        setOpen(false);
        return;
      }

      if (Notification.permission === "denied") {
        setOpen(false);
        return;
      }

      const remindUntil = Number(localStorage.getItem(REMIND_LATER_KEY) ?? 0);

      if (Date.now() < remindUntil) {
        setOpen(false);
        return;
      }

      const registration = await getActiveServiceWorkerRegistration();

      const existingSubscription =
        await registration.pushManager.getSubscription();

      if (existingSubscription) {
        const isEnabledInDb = await checkPushSubscriptionEnabled(
          existingSubscription.endpoint,
        );

        if (isEnabledInDb) {
          setOpen(false);
          return;
        }

        await existingSubscription.unsubscribe();
      }

      if (Notification.permission !== "granted") {
        setOpen(true);
      }
    }

    checkShouldShowModal().catch((error) => {
      console.error("Push modal check failed:", error);
      setOpen(false);
    });
  }, [isLoaded, isSignedIn]);

  function remindMeLater() {
    localStorage.setItem(
      REMIND_LATER_KEY,
      String(Date.now() + REMIND_LATER_MS),
    );

    setOpen(false);
  }

  async function enableAlerts() {
    setIsLoading(true);

    try {
      if (!isPushSupported()) {
        toast.error("Push notifications are not supported on this browser.");
        setOpen(false);
        return;
      }

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!vapidPublicKey) {
        toast.error("Missing VAPID public key.");
        return;
      }

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        toast.error("Notification permission was denied.");
        setOpen(false);
        return;
      }

      const registration = await getActiveServiceWorkerRegistration();

      const existingSubscription =
        await registration.pushManager.getSubscription();

      const subscription =
        existingSubscription ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        }));

      const result = await savePushSubscription(
        toPushSubscriptionPayload(subscription),
      );

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      localStorage.removeItem(REMIND_LATER_KEY);

      toast.success(result.message);
      setOpen(false);
    } catch (error) {
      console.error("Enable alerts failed:", error);
      toast.error("Failed to enable alerts.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[92vw] rounded-2xl border border-white/10 bg-neutral-950 text-white sm:max-w-md">
        <DialogHeader>
          <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-red-600/15 text-red-500">
            <Bell className="size-6" />
          </div>

          <DialogTitle className="text-xl font-black uppercase">
            Enable Ride Alerts
          </DialogTitle>

          <DialogDescription className="text-sm leading-6 text-white/60">
            Get notified when your membership is approved, new events are
            posted, QR attendance opens, or your build gets published.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid gap-3">
          <Button
            type="button"
            onClick={enableAlerts}
            disabled={isLoading}
            className="h-12 rounded-xl bg-red-600 font-black uppercase text-white hover:bg-red-700"
          >
            {isLoading ? "Enabling..." : "Enable Alerts"}
          </Button>

          <Button
            type="button"
            onClick={remindMeLater}
            variant="outline"
            disabled={isLoading}
            className="h-12 rounded-xl border-white/10 bg-white/5 font-black uppercase text-white hover:bg-white/10"
          >
            Remind Me Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
