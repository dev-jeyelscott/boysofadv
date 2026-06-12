"use client";

import { ChevronDown, Filter, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  search: string;
  category: string;
  status: string;
  categories: string[];
};

const controlClassName =
  "h-8 w-full rounded-md border-white/40 bg-black text-white placeholder:text-white/30";

const selectContentClassName = "border-white/10 bg-zinc-950 text-white";

const clearButtonClassName =
  "inline-flex h-8 w-full items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white lg:w-auto";

export function PartnersFilters({
  search,
  category,
  status,
  categories,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasActiveFilters =
    Boolean(search) || Boolean(category) || Boolean(status);

  const [isOpen, setIsOpen] = useState(hasActiveFilters);

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const queryString = params.toString();
    router.push(
      queryString ? `/admin/partners?${queryString}` : "/admin/partners",
    );
  }

  function clearFilters() {
    setIsOpen(false);
    router.push("/admin/partners");
  }

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
        className={`mt-3 grid gap-3 sm:grid-cols-2 lg:mt-0 lg:grid lg:grid-cols-[minmax(240px,1fr)_180px_180px_auto] lg:items-center ${
          isOpen ? "grid" : "hidden lg:grid"
        }`}
      >
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/70" />

          <Input
            defaultValue={search}
            placeholder="Search partner name..."
            className={`${controlClassName} pl-10`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateFilter("search", e.currentTarget.value.trim());
              }
            }}
          />
        </div>

        <Select
          value={category || "all"}
          onValueChange={(value) => updateFilter("category", value)}
        >
          <SelectTrigger className={controlClassName}>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>

          <SelectContent className={selectContentClassName}>
            <SelectItem value="all">All Categories</SelectItem>

            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={status || "all"}
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger className={controlClassName}>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>

          <SelectContent className={selectContentClassName}>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
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
