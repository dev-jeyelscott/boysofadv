"use client";

import { ChevronDown, Filter, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MembersFiltersProps = {
  chapters: string[];
  units: string[];
};

const controlClassName =
  "h-8 w-full rounded-md border-white/40 bg-black text-white placeholder:text-white/30";

const selectContentClassName = "border-white/10 bg-zinc-950 text-white";

const clearButtonClassName =
  "inline-flex h-8 w-full items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white lg:w-auto";

export function MembersFilters({ chapters, units }: MembersFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasActiveFilters =
    Boolean(searchParams.get("search")) ||
    (searchParams.get("status") ?? "all") !== "all" ||
    (searchParams.get("chapter") ?? "all") !== "all" ||
    (searchParams.get("unit") ?? "all") !== "all";

  const [isOpen, setIsOpen] = useState(hasActiveFilters);

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
    const queryString = createQueryString(key, value);
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const clearFilters = () => {
    setIsOpen(false);
    router.push(pathname);
  };

  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";
  const chapter = searchParams.get("chapter") ?? "all";
  const unit = searchParams.get("unit") ?? "all";

  return (
    <div className="p-4">
      {/* Mobile only toggle */}
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
        className={`mt-3 grid gap-3 sm:grid-cols-2 lg:mt-0 lg:grid lg:grid-cols-[minmax(260px,1fr)_180px_220px_220px_auto] lg:items-center ${
          isOpen ? "grid" : "hidden lg:grid"
        }`}
      >
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/70" />

          <Input
            defaultValue={search}
            placeholder="Search name, email, nickname, codename..."
            className={`${controlClassName} pl-10`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateFilter("search", e.currentTarget.value);
              }
            }}
          />
        </div>

        <Select
          value={status}
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger className={controlClassName}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent className={selectContentClassName}>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="approved">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={unit}
          onValueChange={(value) => updateFilter("unit", value)}
        >
          <SelectTrigger className={controlClassName}>
            <SelectValue placeholder="Motorcycle Unit" />
          </SelectTrigger>

          <SelectContent className={selectContentClassName}>
            <SelectItem value="all">All Units</SelectItem>

            {units.map((unit) => (
              <SelectItem key={unit} value={unit}>
                {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={chapter}
          onValueChange={(value) => updateFilter("chapter", value)}
        >
          <SelectTrigger className={controlClassName}>
            <SelectValue placeholder="Chapter" />
          </SelectTrigger>

          <SelectContent className={selectContentClassName}>
            <SelectItem value="all">All Chapters</SelectItem>

            {chapters.map((chapter) => (
              <SelectItem key={chapter} value={chapter}>
                {chapter}
              </SelectItem>
            ))}
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
