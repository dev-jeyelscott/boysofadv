"use client";

import { Loader2, Search, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Input } from "@/components/ui/input";

const SEARCH_DEBOUNCE_MS = 1000;

type BuildsSearchProps = {
  currentSearch?: string;
};

export function BuildsSearch({ currentSearch = "" }: BuildsSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(() => currentSearch);

  const trimmedSearch = search.trim();
  const isSearching = trimmedSearch !== currentSearch;

  useEffect(() => {
    if (trimmedSearch === currentSearch) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);

      if (trimmedSearch) {
        params.set("q", trimmedSearch);
      } else {
        params.delete("q");
      }

      const queryString = params.toString();
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
      const currentUrl = `${window.location.pathname}${window.location.search}`;

      if (nextUrl === currentUrl) {
        return;
      }

      startTransition(() => {
        router.replace(nextUrl, {
          scroll: false,
        });
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeout);
  }, [trimmedSearch, currentSearch, pathname, router]);

  function clearSearch() {
    setSearch("");

    const params = new URLSearchParams(window.location.search);
    params.delete("q");

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.replace(nextUrl, {
        scroll: false,
      });
    });
  }

  return (
    <div className="mx-auto mb-10 max-w-2xl">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/70" />

        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search title, model, engine, CVT, wheels, accessories..."
          className="h-12 rounded-2xl border-white/10 bg-white/5 pl-11 pr-11 text-white placeholder:text-white/35 focus-visible:ring-red-600"
        />

        {search && (
          <button
            type="button"
            onClick={clearSearch}
            disabled={isPending}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 transition hover:text-white"
            aria-label="Clear search"
          >
            {isSearching ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <X className="size-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
