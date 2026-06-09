import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";

import { CustomUserButton } from "../auth/custom-user-button";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/boysofadv.png"
            alt="Boys of ADV"
            width={130}
            height={50}
          />
        </Link>

        {/* Desktop Navigation */}
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

        {/* Mobile Navigation */}
        <div className="flex items-center gap-3 md:hidden">
          <Show when="signed-in">
            <CustomUserButton />
          </Show>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="border-white/10 bg-black text-white"
            >
              <div className="mt-10 ml-10 flex flex-col gap-6">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-black uppercase tracking-wider text-white/80 transition hover:text-red-500"
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6">
                  <Show when="signed-out">
                    <SignInButton>
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        Sign In
                      </Button>
                    </SignInButton>

                    <SignUpButton>
                      <Button
                        variant="outline"
                        className="w-full border-red-600 bg-transparent text-white"
                      >
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </Show>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
