import Image from "next/image";
import Link from "next/link";
import {
  Show,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { CustomUserButton } from "../auth/custom-user-button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/boysofadv.png"
            alt="Boys of ADV"
            width={130}
            height={50}
            priority
            className="h-auto w-[130px]"
          />
        </Link>

        {/* Navigation + Auth */}
        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-6 text-sm font-black uppercase tracking-wide text-white/70">
            <Link href="/about" className="transition hover:text-white">
              About
            </Link>
            <Link href="/builds" className="transition hover:text-white">
              Builds
            </Link>
            <Link href="/partners" className="transition hover:text-white">
              Partners
            </Link>
            <Link href="/events" className="transition hover:text-white">
              Events
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton>
                <button className="-skew-x-12 bg-red-600 px-5 py-2 text-sm font-black uppercase text-white transition tracking-wide hover:bg-red-700">
                  Sign In
                </button>
                </SignInButton>
              <SignUpButton>
                <button className="-skew-x-12 border border-red-600 px-5 py-2 text-sm font-black uppercase text-white transition tracking-wide hover:bg-white/20">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <CustomUserButton />
            </Show>
          </div>
        </div>
      </div>
    </header>
  );
}