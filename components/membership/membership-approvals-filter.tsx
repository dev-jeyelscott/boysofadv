"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  chapters: string[];
  units: string[];
};

export function MembershipApprovalsFilter({ chapters, units }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams);

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/admin/memberships ");
  }

  return (
    <div className="p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:items-center lg:gap-4">
        <div className="relative sm:col-span-2 lg:flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />

          <Input
            defaultValue={searchParams.get("search") ?? ""}
            placeholder="Search name, email, nickname, codename..."
            className="h-11 w-full pl-10"
            onChange={(event) => updateParam("search", event.target.value)}
          />
        </div>

        <Select
          value={searchParams.get("chapter") ?? "all"}
          onValueChange={(value) => updateParam("chapter", value)}
        >
          <SelectTrigger className="h-11 w-full border-white/40 bg-black text-white lg:w-[180px]">
            <SelectValue placeholder="Chapter" />
          </SelectTrigger>

          <SelectContent className="border-white/10 bg-zinc-950 text-white">
            <SelectItem value="all">All Chapters</SelectItem>
            {chapters.map((chapter) => (
              <SelectItem key={chapter} value={chapter}>
                {chapter}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("unit") ?? "all"}
          onValueChange={(value) => updateParam("unit", value)}
        >
          <SelectTrigger className="h-11 w-full border-white/40 bg-black text-white lg:w-[180px]">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>

          <SelectContent className="border-white/10 bg-zinc-950 text-white">
            <SelectItem value="all">All Units</SelectItem>
            {units.map((unit) => (
              <SelectItem key={unit} value={unit}>
                {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white sm:col-span-2 lg:w-auto"
        >
          <X className="size-4" />
          Clear
        </button>
      </div>
    </div>
  );
}
