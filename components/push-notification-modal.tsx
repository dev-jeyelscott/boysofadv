// components/push-notification-modal.tsx
"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useUser } from "@clerk/nextjs";

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

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = `${base64String}${padding}`
    .replaceAll("-", "+")
    .replaceAll("_", "/");

  const rawData = window.atob(base64);

  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function PushNotificationModal() {
  const { isLoaded, isSignedIn } = useUser();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkShouldShowModal() {
      if (!isLoaded) {
        return;
      }

      if (!isSignedIn) {
        setOpen(false);
        return;
      }

      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        return;
      }

      if (!("Notification" in window)) {
        return;
      }

      if (Notification.permission === "granted") {
        return;
      }

      if (Notification.permission === "denied") {
        return;
      }

      const remindUntil = Number(localStorage.getItem(REMIND_LATER_KEY) ?? 0);

      if (Date.now() < remindUntil) {
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        return;
      }

      setOpen(true);
    }

    checkShouldShowModal();
  }, [isLoaded, isSignedIn]);

  function remindMeLater() {
    localStorage.setItem(
      REMIND_LATER_KEY,
      String(Date.now() + REMIND_LATER_MS),
    );

    setOpen(false);
  }

  async function enableAlerts() {
    if (!isLoaded || !isSignedIn) {
      setOpen(false);
      return;
    }

    setIsLoading(true);

    try {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        return;
      }

      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        ),
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });

      localStorage.removeItem(REMIND_LATER_KEY);
      setOpen(false);
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
            Enable Alerts
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
