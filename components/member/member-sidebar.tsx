"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bike, Home, LogOut, Menu, UserRound, X, Bell } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Profile", href: "/member/profile", icon: UserRound },
  { label: "My Build", href: "/member/my-build", icon: Bike },
];

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

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = `${base64String}${padding}`
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
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

async function getServiceWorkerRegistration() {
  if (!("serviceWorker" in navigator)) return null;

  const registration = await navigator.serviceWorker.getRegistration();

  if (registration) return registration;

  return Promise.race<ServiceWorkerRegistration | null>([
    navigator.serviceWorker.ready,
    new Promise((resolve) => {
      window.setTimeout(() => resolve(null), 3000);
    }),
  ]);
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
    message: data.message ?? "Failed to subscribe push subscription.",
  };
}

async function unsubscribePushSubscription(endpoint: string) {
  const response = await fetch("/api/push/unsubscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ endpoint }),
  });

  const data = (await response.json().catch(() => ({}))) as PushApiResponse;

  return {
    success: response.ok,
    message: data.message ?? "Failed to unsubscribe.",
  };
}

export function MemberSidebar() {
  const { signOut } = useClerk();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [isAlertsLoading, setIsAlertsLoading] = useState(false);

  async function enableAlerts() {
    if (
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !("Notification" in window)
    ) {
      toast.error("Push notifications are not supported on this browser.");
      setAlertsEnabled(false);
      return;
    }

    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    if (!vapidPublicKey) {
      toast.error("Missing VAPID public key.");
      setAlertsEnabled(false);
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      toast.error("Notification permission was denied.");
      setAlertsEnabled(false);
      return;
    }

    const registration = await getServiceWorkerRegistration();

    if (!registration) {
      toast.error("Service worker is not ready. Build and run the PWA first.");
      setAlertsEnabled(false);
      return;
    }

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
      setAlertsEnabled(false);
      toast.error(result.message);
      return;
    }

    setAlertsEnabled(true);
    toast.success(result.message);
  }

  async function disableAlerts() {
    const registration = await getServiceWorkerRegistration();

    if (!registration) {
      setAlertsEnabled(false);
      toast.success("Alerts disabled.");
      return;
    }

    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      setAlertsEnabled(false);
      toast.success("Alerts disabled.");
      return;
    }

    const result = await unsubscribePushSubscription(subscription.endpoint);

    if (!result.success) {
      setAlertsEnabled(true);
      toast.error(result.message);
      return;
    }

    await subscription.unsubscribe();

    setAlertsEnabled(false);
    toast.success(result.message);
  }

  async function handleAlertsChange(checked: boolean) {
    if (isAlertsLoading) return;

    const previousValue = alertsEnabled;

    setAlertsEnabled(checked);
    setIsAlertsLoading(true);

    try {
      if (checked) {
        await enableAlerts();
      } else {
        await disableAlerts();
      }
    } catch (error) {
      console.error("Failed to update alert settings:", error);
      setAlertsEnabled(previousValue);
      toast.error("Failed to update alert settings.");
    } finally {
      setIsAlertsLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function checkAlertsStatus() {
      setIsAlertsLoading(true);

      try {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
          if (mounted) setAlertsEnabled(false);
          return;
        }

        const registration = await getServiceWorkerRegistration();

        if (!registration) {
          if (mounted) setAlertsEnabled(false);
          return;
        }

        const subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
          if (mounted) setAlertsEnabled(false);
          return;
        }

        const response = await fetch("/api/push/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
          }),
        });

        if (!response.ok) {
          if (mounted) setAlertsEnabled(false);
          return;
        }

        const result = (await response.json()) as {
          enabled: boolean;
        };

        if (mounted) setAlertsEnabled(result.enabled);
      } catch (error) {
        console.error("Failed to check alerts status:", error);
        if (mounted) setAlertsEnabled(false);
      } finally {
        if (mounted) setIsAlertsLoading(false);
      }
    }

    checkAlertsStatus();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 top-4 z-40 flex size-11 items-center justify-center rounded-xl border border-white/10 bg-black/90 text-white shadow-lg backdrop-blur transition hover:bg-white/10 md:hidden"
        aria-label="Open member menu"
      >
        <Menu className="size-5" />
      </button>

      {open && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          aria-label="Close member menu overlay"
        />
      )}

      <aside
        className={[
          "fixed right-0 top-0 z-50 flex h-dvh w-72 flex-col border-l border-white/10 bg-black p-4 shadow-2xl transition-transform duration-300",
          "md:sticky md:left-0 md:right-auto md:h-screen md:translate-x-0 md:border-r md:border-l-0",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" onClick={() => setOpen(false)}>
            <Image
              src="/images/boysofadv.png"
              alt="Boys of ADV"
              width={180}
              height={90}
              priority
              className="h-auto w-36"
            />
          </Link>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex size-10 items-center justify-center rounded-xl border border-white/10 text-white/70 transition hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Close member menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={[
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-black uppercase transition",
                  isActive
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                    : "text-white/60 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <div
            className={[
              "rounded-xl border p-4 transition-all duration-200",
              alertsEnabled
                ? "border-red-500/40 bg-red-500/10"
                : "border-white/10 bg-white/5",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Bell
                  className={[
                    "size-4 transition-colors",
                    alertsEnabled ? "text-red-400" : "text-white/50",
                  ].join(" ")}
                />

                <div>
                  <p
                    className={[
                      "text-xs font-black uppercase transition-colors",
                      alertsEnabled ? "text-red-300" : "text-white",
                    ].join(" ")}
                  >
                    Alerts
                  </p>

                  <p
                    className={[
                      "text-[11px] transition-colors",
                      alertsEnabled ? "text-red-200/70" : "text-white/50",
                    ].join(" ")}
                  >
                    Push notifications
                  </p>
                </div>
              </div>

              <Switch
                checked={alertsEnabled}
                disabled={isAlertsLoading}
                onCheckedChange={handleAlertsChange}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => signOut({ redirectUrl: "/" })}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-black uppercase text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
