"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bike, Home, LogOut, Menu, UserRound, X } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Profile", href: "/member/profile", icon: UserRound },
  { label: "My Build", href: "/member/my-build", icon: Bike },
];

export function MemberSidebar() {
  const { signOut } = useClerk();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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

        <div className="mt-auto flex flex-col gap-2">
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
