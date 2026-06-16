"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  Activity,
  BadgeCheck,
  Bike,
  CalendarDays,
  Handshake,
  LayoutDashboard,
  LogOut,
  Menu,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Members",
    href: "/admin/members",
    icon: UsersRound,
  },
  {
    label: "Partners",
    href: "/admin/partners",
    icon: Handshake,
  },
  {
    label: "Builds",
    href: "/admin/builds",
    icon: Bike,
  },
  {
    label: "Memberships",
    href: "/admin/memberships",
    icon: BadgeCheck,
  },
  {
    label: "Partnerships",
    href: "/admin/partnerships",
    icon: Handshake,
  },
  {
    label: "Events",
    href: "/admin/events",
    icon: CalendarDays,
  },
  {
    label: "Observability",
    href: "/admin/observability",
    icon: Activity,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-black px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl border border-white/10 p-2 text-white"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/">
          <Image
            src="/images/boysofadv.png"
            alt="Boys of ADV"
            width={120}
            loading="lazy"
            quality={75}
            height={60}
            className="h-auto w-auto"
          />
        </Link>
      </div>

      {/* Mobile Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-white/10 bg-black transition-transform duration-300 md:sticky md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between p-6">
          <Link href="/">
            <Image
              src="/images/boysofadv.png"
              alt="Boys of ADV"
              width={180}
              height={90}
              loading="lazy"
              quality={75}
            />
          </Link>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl border border-white/10 p-2 text-white md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={[
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black uppercase transition",
                  isActive
                    ? "bg-red-600 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={() => signOut({ redirectUrl: "/" })}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black uppercase text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
