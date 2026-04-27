"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemCard } from "@/components/dashboard/item-card";
import type { Item, ItemStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type SortKey = "name" | "brand" | "date" | "status";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "brand", label: "Brand" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
];

const STATUS_ORDER: Record<ItemStatus, number> = {
  AVAILABLE: 0,
  IN_USE: 1,
  REPAIR: 2,
};

function matchesQuery(item: Item, query: string): boolean {
  const haystack = [item.name, item.brand, item.notes ?? ""]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function compareItems(a: Item, b: Item, sortKey: SortKey): number {
  switch (sortKey) {
    case "name":
      return a.name.localeCompare(b.name);
    case "brand":
      return a.brand.localeCompare(b.brand);
    case "date": {
      const aTime = a.purchaseDate ? new Date(a.purchaseDate).getTime() : NaN;
      const bTime = b.purchaseDate ? new Date(b.purchaseDate).getTime() : NaN;
      const aValid = !Number.isNaN(aTime);
      const bValid = !Number.isNaN(bTime);
      if (!aValid && !bValid) return 0;
      if (!aValid) return 1;
      if (!bValid) return -1;
      return bTime - aTime;
    }
    case "status":
      return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
  }
}

export function HardwareList({ items }: { items: Item[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");

  const visible = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    const filtered = trimmed
      ? items.filter((item) => matchesQuery(item, trimmed))
      : items;
    return [...filtered].sort((a, b) => compareItems(a, b, sortKey));
  }, [items, query, sortKey]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-mono text-2xl font-bold tracking-tight">
          Hardware List
        </h1>
        <p className="text-muted-foreground text-sm">
          Browse and rent available equipment
        </p>
      </header>

      <div className="relative">
        <Sparkles className="text-brand pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search hardware..."
          aria-label="Search hardware"
          className="h-11 pl-10"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground mr-1 text-xs font-medium uppercase tracking-wider">
          Sort
        </span>
        {SORT_OPTIONS.map((option) => {
          const isActive = option.key === sortKey;
          return (
            <Button
              key={option.key}
              type="button"
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setSortKey(option.key)}
              className={cn(
                isActive &&
                  "bg-brand text-brand-foreground hover:bg-brand/90",
              )}
              aria-pressed={isActive}
            >
              {option.label}
            </Button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="text-muted-foreground border-border rounded-lg border border-dashed p-8 text-center text-sm">
          No items match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
