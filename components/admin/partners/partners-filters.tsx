"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

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

export function PartnersFilters({
  search,
  category,
  status,
  categories,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/admin/partners?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/admin/partners");
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />

          <Input
            defaultValue={search}
            placeholder="Search partner name..."
            className=" pl-10"
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
          <SelectTrigger className="w-full lg:w-45">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>

          <SelectContent>
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
          <SelectTrigger className="w-full lg:w-45">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

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
