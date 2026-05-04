"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { AddDeviceDialog } from "@/components/admin/add-device-dialog";
import { AdminItemActions } from "@/components/admin/admin-item-actions";
import { ItemCard, type ItemCardView } from "@/components/items/item-card";
import { ViewToggle } from "@/components/items/view-toggle";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ITEM_CATEGORIES,
  ITEM_CATEGORY_LABEL,
} from "@/lib/items/category";
import type { Item, ItemCategory, ItemStatus } from "@/lib/mock-data";
import { FILTER_ACTIVE_BUTTON, cn } from "@/lib/utils";

type SortKey = "name" | "brand" | "date" | "status";
type StatusFilter = "ALL" | ItemStatus;
type CategoryFilter = "ALL" | ItemCategory;

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "brand", label: "Brand" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
];

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "AVAILABLE", label: "Available" },
  { value: "IN_USE", label: "In use" },
  { value: "REPAIR", label: "Repair" },
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

export function AdminInventory({
  items,
  brandOptions,
}: {
  items: Item[];
  brandOptions: string[];
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("ALL");
  const [view, setView] = useState<ItemCardView>("grid");

  const visible = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    let filtered = trimmed
      ? items.filter((item) => matchesQuery(item, trimmed))
      : items;

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }
    if (categoryFilter !== "ALL") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    return [...filtered].sort((a, b) => compareItems(a, b, sortKey));
  }, [items, query, sortKey, statusFilter, categoryFilter]);

  const hasActiveQuery = query.trim().length > 0;
  const hasActiveFilter = statusFilter !== "ALL" || categoryFilter !== "ALL";

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-mono text-2xl font-bold tracking-tight">
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage the company hardware inventory
          </p>
        </div>
        <AddDeviceDialog brandOptions={brandOptions} />
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search inventory..."
              aria-label="Search inventory"
              className="h-9 pl-9"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          >
            <SelectTrigger
              className="h-9 w-36"
              aria-label="Filter by status"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={categoryFilter}
            onValueChange={(v) => setCategoryFilter(v as CategoryFilter)}
          >
            <SelectTrigger
              className="h-9 w-40"
              aria-label="Filter by category"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All categories</SelectItem>
              {ITEM_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {ITEM_CATEGORY_LABEL[category]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ButtonGroup aria-label="Sort">
            {SORT_OPTIONS.map((option) => {
              const isActive = option.key === sortKey;
              return (
                <Button
                  key={option.key}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSortKey(option.key)}
                  className={cn(isActive && FILTER_ACTIVE_BUTTON)}
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
          {hasActiveQuery || hasActiveFilter
            ? "No items match your filters."
            : "No items to show."}
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              view="grid"
              action={
                <AdminItemActions item={item} brandOptions={brandOptions} />
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
                <AdminItemActions item={item} brandOptions={brandOptions} />
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
