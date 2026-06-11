import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";

import { CustomUserButton } from "../auth/custom-user-button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
  { label: "About", href: "/about" },
  { label: "Builds", href: "/builds" },
  { label: "Partners", href: "/partners" },
  { label: "Events", href: "/events" },
  { label: "Be a Partner", href: "/be-a-partner" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:h-20 sm:px-6 md:flex md:justify-between lg:px-8">
        {/* Mobile left: menu */}
        <div className="flex items-center justify-start md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-10 text-white hover:bg-white/10"
                aria-label="Open navigation menu"
              >
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[82vw] max-w-xs border-white/10 bg-zinc-950 px-5 text-white"
            >
              <SheetTitle className="sr-only">Site navigation</SheetTitle>

              <div className="flex h-full flex-col pt-12">
                <nav className="flex flex-col gap-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-xl px-3 py-3 text-base font-black uppercase tracking-wider text-white/80 transition hover:bg-white/10 hover:text-red-500"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto border-t border-white/10 py-6">
                  <Show when="signed-out">
                    <div className="flex flex-col gap-3">
                      <SignInButton>
                        <Button className="h-11 w-full bg-red-600 font-black uppercase hover:bg-red-700">
                          Sign In
                        </Button>
                      </SignInButton>

                      <SignUpButton>
                        <Button
                          variant="outline"
                          className="h-11 w-full border-red-600 bg-transparent font-black uppercase text-white hover:bg-white/10 hover:text-white"
                        >
                          Sign Up
                        </Button>
                      </SignUpButton>
                    </div>
                  </Show>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Center logo on mobile */}
        <Link
          href="/"
          className="flex shrink-0 items-center justify-center md:justify-start"
        >
          <Image
            src="/images/boysofadv.png"
            alt="Boys of ADV"
            width={110}
            height={42}
            priority
            className="h-auto w-[105px] sm:w-[130px]"
          />
        </Link>

        {/* Mobile right: user menu */}
        <div className="flex items-center justify-end md:hidden">
          <Show when="signed-in">
            <CustomUserButton />
          </Show>

          <Show when="signed-out">
            <SignInButton>
              <Button
                size="sm"
                className="h-9 bg-red-600 px-3 text-xs font-black uppercase hover:bg-red-700"
              >
                Sign In
              </Button>
            </SignInButton>
          </Show>
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-8 text-sm font-black uppercase tracking-wide text-white/70">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition duration-300 ease-out hover:scale-105 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton>
                <button className="-skew-x-12 bg-red-600 px-5 py-2 text-sm font-black uppercase tracking-wide text-white transition duration-300 ease-out hover:scale-105 hover:bg-red-700">
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton>
                <button className="-skew-x-12 border border-red-600 px-5 py-2 text-sm font-black uppercase tracking-wide text-white transition duration-300 ease-out hover:scale-105 hover:bg-white/20">
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
