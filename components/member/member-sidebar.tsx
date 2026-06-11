"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bike, Home, LogOut, Menu, UserRound, X, Bell } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import {
  deletePushSubscriptionsAction,
  getPushNotificationStatusAction,
  savePushSubscriptionAction,
} from "./member-sidebar-action";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Profile", href: "/member/profile", icon: UserRound },
  { label: "My Build", href: "/member/my-build", icon: Bike },
];

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = `${base64String}${padding}`
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function MemberSidebar() {
  const { signOut } = useClerk();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const enabled = await getPushNotificationStatusAction();
      setAlertsEnabled(enabled);
    });
  }, []);

  async function enableAlerts() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      toast.error("Push notifications are not supported on this browser.");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      toast.error("Notification permission was denied.");
      setAlertsEnabled(false);
      return;
    }

    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    if (!vapidPublicKey) {
      toast.error("Missing VAPID public key.");
      setAlertsEnabled(false);
      return;
    }

    const registration = await navigator.serviceWorker.ready;

    const existingSubscription =
      await registration.pushManager.getSubscription();

    const subscription =
      existingSubscription ??
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      }));

    const result = await savePushSubscriptionAction(
      subscription.toJSON() as {
        endpoint: string;
        keys: {
          p256dh: string;
          auth: string;
        };
      },
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
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
      }
    }

    const result = await deletePushSubscriptionsAction();

    if (!result.success) {
      setAlertsEnabled(true);
      toast.error(result.message);
      return;
    }

    setAlertsEnabled(false);
    toast.success(result.message);
  }

  function handleAlertsChange(checked: boolean) {
    setAlertsEnabled(checked);

    startTransition(async () => {
      try {
        if (checked) {
          await enableAlerts();
        } else {
          await disableAlerts();
        }
      } catch (error) {
        console.error(error);
        setAlertsEnabled(!checked);
        toast.error("Failed to update alert settings.");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 flex size-11 items-center justify-center rounded-xl border border-white/10 bg-black/90 text-white shadow-lg backdrop-blur transition hover:bg-white/10"
        aria-label="Open member menu"
      >
        <Menu className="size-5" />
      </button>

      {open && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          aria-label="Close member menu overlay"
        />
      )}

      <aside
        className={[
          "fixed left-0 top-0 z-50 flex h-dvh w-72 flex-col border-r border-white/10 bg-black p-4 shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
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
            className="flex size-10 items-center justify-center rounded-xl border border-white/10 text-white/70 transition hover:bg-white/10 hover:text-white"
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
                disabled={isPending}
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
