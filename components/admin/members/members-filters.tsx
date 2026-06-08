"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

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

export function MembersFilters({ chapters, units }: MembersFiltersProps) {
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
  const chapter = searchParams.get("chapter") ?? "all";
  const unit = searchParams.get("unit") ?? "all";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />

          <Input
            defaultValue={search}
            placeholder="Search name, email, nickname, codename..."
            className="pl-10"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateFilter("search", (e.target as HTMLInputElement).value);
              }
            }}
          />
        </div>

        {/* Status */}
        <Select
          value={status}
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger className="w-full lg:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="approved">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>

        {/* MC Unit */}
        <Select
          value={unit}
          onValueChange={(value) => updateFilter("unit", value)}
        >
          <SelectTrigger className="w-full lg:w-[220px]">
            <SelectValue placeholder="Motorcycle Unit" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Units</SelectItem>

            {units.map((unit) => (
              <SelectItem key={unit} value={unit}>
                {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Chapter */}
        <Select
          value={chapter}
          onValueChange={(value) => updateFilter("chapter", value)}
        >
          <SelectTrigger className="w-full lg:w-[220px]">
            <SelectValue placeholder="Chapter" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Chapters</SelectItem>

            {chapters.map((chapter) => (
              <SelectItem key={chapter} value={chapter}>
                {chapter}
              </SelectItem>
            ))}
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
