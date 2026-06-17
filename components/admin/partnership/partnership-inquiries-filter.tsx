"use client";

import { ChevronDown, Filter, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PartnershipInquiriesFilterProps = {
  search: string;
  status: string;
};

const controlClassName =
  "h-8 w-full rounded-md border-white/40 bg-black text-white placeholder:text-white/30";

const selectContentClassName = "border-white/10 bg-zinc-950 text-white";

const clearButtonClassName =
  "inline-flex h-8 w-full items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white lg:w-auto";

export function PartnershipInquiriesFilter({
  search,
  status,
}: PartnershipInquiriesFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasActiveFilters = Boolean(search) || Boolean(status);
  const [isOpen, setIsOpen] = useState(hasActiveFilters);

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  function clearFilters() {
    setIsOpen(false);
    router.push(pathname);
  }

  return (
    <div className="p-4">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        className="inline-flex h-8 w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/4 px-4 text-sm font-medium text-white transition hover:bg-white/10 lg:hidden"
      >
        <Filter className="size-4" />
        Filters
        <ChevronDown
          className={`size-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`mt-3 grid gap-3 sm:grid-cols-2 lg:mt-0 lg:grid lg:grid-cols-[minmax(240px,1fr)_180px_auto] lg:items-center ${
          isOpen ? "grid" : "hidden lg:grid"
        }`}
      >
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/70" />

          <Input
            defaultValue={search}
            placeholder="Search business or contact person..."
            className={`${controlClassName} pl-10`}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                updateFilter("search", event.currentTarget.value.trim());
              }
            }}
          />
        </div>

        <Select
          value={status || "all"}
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger className={controlClassName}>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>

          <SelectContent className={selectContentClassName}>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <button
          type="button"
          onClick={clearFilters}
          className={clearButtonClassName}
        >
          <X className="size-4" />
          Clear
        </button>
      </div>
    </div>
  );
}
