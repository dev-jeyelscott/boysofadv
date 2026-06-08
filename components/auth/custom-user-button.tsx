"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  ChevronDown,
  Gauge,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react";

type DbUser = {
  role: "super_admin" | "admin" | "member";
  status: "approved" | "for_approval" | "rejected";
};


export function CustomUserButton() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);

  
  useEffect(() => {
    async function fetchDbUser() {
      const res = await fetch("/api/me");
      const data = await res.json();
      setDbUser(data.user);
    }

    fetchDbUser();
  }, []);

  if (!isLoaded || !user) return null;

  const displayName =
    user.fullName ||
    user.username ||
    user.primaryEmailAddress?.emailAddress ||
    "Member";

    const canAccessAdmin =
    dbUser?.role === "super_admin" || dbUser?.role === "admin";


  const imageUrl = user.imageUrl;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-3 rounded-full border border-white/10 bg-white/4 px-2 py-2 text-left text-white transition hover:border-red-500/50 hover:bg-red-600/10"
      >
        <img
          src={imageUrl}
          alt={displayName}
          className="h-9 w-9 rounded-full border border-red-600/40 object-cover"
        />

        <div className="hidden leading-tight md:block">
          <p className="max-w-32 truncate text-xs font-black uppercase tracking-wide text-white">
            {displayName}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-2 text-red-500">
            BoADV {dbUser?.role ?? "member"}
          </p>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-white/60 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl shadow-red-950/30">
          <div className="border-b border-white/10 bg-linear-to-r from-red-950/60 to-black p-4">
            <div className="flex items-center gap-3">
              <img
                src={imageUrl}
                alt={displayName}
                className="h-12 w-12 rounded-full border border-red-500/50 object-cover"
              />

              <div className="min-w-0">
                <p className="truncate text-sm font-black uppercase text-white">
                  {displayName}
                </p>
                <p className="truncate text-xs text-white/50">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <MenuLink href="/profile" icon={<User className="h-4 w-4" />}>
              My Profile
            </MenuLink>

            {canAccessAdmin && (
              <MenuLink href="/admin/dashboard" icon={<Gauge className="h-4 w-4" />}>
                Admin Dashboard
              </MenuLink>
            )}

            <MenuLink href="/member/build" icon={<ShieldCheck className="h-4 w-4" />}>
              My ADV Build
            </MenuLink>

            <button
              type="button"
              onClick={() => signOut({ redirectUrl: "/" })}
              className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold uppercase text-red-400 transition hover:bg-red-600/15 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold uppercase text-white/75 transition hover:bg-white/6 hover:text-white"
    >
      <span className="text-red-500">{icon}</span>
      {children}
    </Link>
  );
}