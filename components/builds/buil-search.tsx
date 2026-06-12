"use client";

import { Loader2, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Input } from "@/components/ui/input";

const SEARCH_DEBOUNCE_MS = 1000;

type BuildsSearchProps = {
  onSearchingChange?: (isSearching: boolean) => void;
};

export function BuildsSearch({ onSearchingChange }: BuildsSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("q") ?? "";
  const [search, setSearch] = useState(currentSearch);

  useEffect(() => {
    setSearch(currentSearch);
    onSearchingChange?.(false);
  }, [currentSearch, onSearchingChange]);

  useEffect(() => {
    const trimmedSearch = search.trim();

    if (trimmedSearch === currentSearch) {
      onSearchingChange?.(false);
      return;
    }

    onSearchingChange?.(true);

    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (trimmedSearch) {
        params.set("q", trimmedSearch);
      } else {
        params.delete("q");
      }

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeout);
  }, [
    search,
    currentSearch,
    pathname,
    router,
    searchParams,
    onSearchingChange,
  ]);

  function clearSearch() {
    setSearch("");
    onSearchingChange?.(true);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    });
  }

  const isSearching = isPending || search.trim() !== currentSearch;

  return (
    <div className="mx-auto mb-10 max-w-2xl">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/40" />

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
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white"
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
