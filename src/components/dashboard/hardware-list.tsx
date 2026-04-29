"use client";

import { useMemo, useOptimistic, useState } from "react";
import { Sparkles } from "lucide-react";

import { rentItemAction, type ActionResult } from "@/actions/rentals";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { ItemCard, type ItemCardView } from "@/components/items/item-card";
import { RentDialog } from "@/components/items/rent-dialog";
import { ViewToggle } from "@/components/items/view-toggle";
import type { Item, ItemStatus } from "@/lib/mock-data";
import type { RentalPeriodDays } from "@/lib/rental-status";
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

const ACTIVE_BUTTON =
  "bg-brand text-brand-foreground border-brand hover:bg-brand/90 hover:text-brand-foreground";

export function HardwareList({ items }: { items: Item[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [view, setView] = useState<ItemCardView>("grid");

  const [optimisticItems, markRented] = useOptimistic<Item[], string>(
    items,
    (state, rentedId) =>
      state.map((item) =>
        item.id === rentedId
          ? { ...item, status: "IN_USE" as const }
          : item,
      ),
  );

  async function handleRent(
    itemId: string,
    rentalDays: RentalPeriodDays,
  ): Promise<ActionResult> {
    markRented(itemId);
    return rentItemAction({ itemId, rentalDays });
  }

  const visible = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    const filtered = trimmed
      ? optimisticItems.filter((item) => matchesQuery(item, trimmed))
      : optimisticItems;
    return [...filtered].sort((a, b) => compareItems(a, b, sortKey));
  }, [optimisticItems, query, sortKey]);

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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            Sort
          </span>
          <ButtonGroup>
            {SORT_OPTIONS.map((option) => {
              const isActive = option.key === sortKey;
              return (
                <Button
                  key={option.key}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSortKey(option.key)}
                  className={cn(isActive && ACTIVE_BUTTON)}
                  aria-pressed={isActive}
                >
                  {option.label}
                </Button>
              );
            })}
          </ButtonGroup>
        </div>

        <ViewToggle value={view} onChange={setView} />
      </div>

      {visible.length === 0 ? (
        <div className="text-muted-foreground border-border rounded-lg border border-dashed p-8 text-center text-sm">
          No items match your search.
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              view="grid"
              action={
                item.status === "AVAILABLE" ? (
                  <RentDialog
                    item={item}
                    onConfirm={(days) => handleRent(item.id, days)}
                  />
                ) : undefined
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {visible.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              view="list"
              action={
                item.status === "AVAILABLE" ? (
                  <RentDialog
                    item={item}
                    onConfirm={(days) => handleRent(item.id, days)}
                  />
                ) : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
