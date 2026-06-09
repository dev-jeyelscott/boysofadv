"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bike, UserRound, LogOut } from "lucide-react";
import Image from "next/image";
import { useClerk } from "@clerk/nextjs";

const navItems = [
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
];

export function MemberSidebar() {
  const { signOut } = useClerk();
  const pathname = usePathname();

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
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-black uppercase transition",
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

      <button
        type="button"
        onClick={() => signOut({ redirectUrl: "/" })}
        className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-black uppercase text-white/60 transition hover:bg-white/10 hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </aside>
  );
}
