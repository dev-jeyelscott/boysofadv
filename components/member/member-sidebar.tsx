"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bike, Settings, UserRound, LayoutDashboard } from "lucide-react";

const navItems = [
  {
    label: "Overview",
    href: "/member",
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    href: "/member/profile",
    icon: UserRound,
  },
  {
    label: "My Build",
    href: "/member/my-build",
    icon: Bike,
  },
  {
    label: "Account Settings",
    href: "/member/account-settings",
    icon: Settings,
  },
];

export function MemberSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-white/10 bg-black/80 p-4 md:min-h-screen md:w-72 md:border-b-0 md:border-r">
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-red-500">
          Member Portal
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase text-white">
          Boys of ADV
        </h2>
      </div>

      <nav className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex min-w-fit items-center gap-3 rounded-xl px-4 py-3 text-sm font-black uppercase transition",
                isActive
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                  : "text-white/60 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}