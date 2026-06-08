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
import Image from "next/image";

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
    <aside className="md:sticky md:top-0 md:h-screen flex w-full flex-col border-b border-white/10 bg-black/80 p-4 md:min-h-screen md:w-72 md:border-b-0 md:border-r">
      <div className="mb-8 flex justify-center">
        <Link href={"/"}>
          <Image
            src="/images/boysofadv.png"
            alt="Boys of ADV"
            width={200}
            height={100}
          />
        </Link>
      </div>

      <nav className="flex flex-col gap-2">
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
