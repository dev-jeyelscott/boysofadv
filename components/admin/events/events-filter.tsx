"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback } from "react";

export function EventsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (!value || value === "all") {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      return params.toString();
    },
    [searchParams],
  );

  const updateFilter = (key: string, value: string) => {
    router.push(`${pathname}?${createQueryString(key, value)}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";

  return (
    <div className="p-4">
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
          <Input
            defaultValue={search}
            placeholder="Search title, location, description..."
            onChange={(e) => updateFilter("q", e.target.value)}
            className="border-white/10 bg-black/40 pl-10 text-white placeholder:text-white/30"
          />
        </div>

        <Select
          value={status}
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger className="w-full lg:w-[220px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear */}
        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
        >
          <X className="size-4" />
          Clear
        </button>
      </div>
    </div>
  );
}
