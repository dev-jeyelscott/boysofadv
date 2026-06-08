"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  search: string;
  model: string;
  concept: string;
  status: string;
  isFeatured: string;
};

export function BuildsFilters({
  search,
  model,
  concept,
  status,
  isFeatured,
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

    router.push(`/admin/builds?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/admin/builds");
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-4">
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

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
          <Input
            defaultValue={model}
            placeholder="All Models"
            className="pl-10"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateFilter("model", e.currentTarget.value);
              }
            }}
          />
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
          <Input
            defaultValue={concept}
            placeholder="All Concepts"
            className="pl-10"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateFilter("concept", e.currentTarget.value);
              }
            }}
          />
        </div>

        <Select
          value={status || "all"}
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger className="h-11 w-[180px] border-white/40 bg-black text-white">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="for_review">For Review</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={isFeatured || "all"}
          onValueChange={(value) => updateFilter("isFeatured", value)}
        >
          <SelectTrigger className="h-11 w-[150px] border-white/40 bg-black text-white">
            <SelectValue placeholder="Featured" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Featured</SelectItem>
            <SelectItem value="true">Featured</SelectItem>
            <SelectItem value="false">Not Featured</SelectItem>
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
