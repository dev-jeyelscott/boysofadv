"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UsersRound,
  Handshake,
  Bike,
  BadgeCheck,
  CalendarDays,
  LogOut,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";

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
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-white/10 bg-black p-4 text-white lg:flex lg:flex-col">
      <Link
        href="/admin/dashboard"
        className="flex items-center gap-3 px-3 py-4"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 font-black">
          ADV
        </div>

        <div>
          <p className="text-sm font-black uppercase leading-none">
            Boys of ADV
          </p>
          <p className="mt-1 text-xs uppercase tracking-widest text-white/40">
            Admin Panel
          </p>
        </div>
      </Link>

      <nav className="mt-6 grid gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black uppercase transition",
                isActive
                  ? "bg-red-600 text-white"
                  : "text-white/55 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() => signOut({ redirectUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black uppercase text-white/55 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
