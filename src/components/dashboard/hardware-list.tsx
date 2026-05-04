"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import { Loader2, Search, Sparkles } from "lucide-react";

import { rentItemAction, type ActionResult } from "@/actions/rentals";
import { aiSearchItemsAction } from "@/actions/search";
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
import { ItemCard, type ItemCardView } from "@/components/items/item-card";
import { RentDialog } from "@/components/items/rent-dialog";
import { ViewToggle } from "@/components/items/view-toggle";
import {
  ITEM_CATEGORIES,
  ITEM_CATEGORY_LABEL,
} from "@/lib/items/category";
import type { Item, ItemCategory, ItemStatus } from "@/lib/mock-data";
import type { RentalPeriodDays } from "@/lib/rental-status";
import { FILTER_ACTIVE_BUTTON, cn } from "@/lib/utils";

type SortKey = "name" | "brand" | "date" | "status";
type SearchMode = "basic" | "ai";
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

function toAiPayload(items: Item[]) {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    brand: item.brand,
    status: item.status,
    notes: item.notes,
  }));
}

export function HardwareList({ items }: { items: Item[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("ALL");
  const [view, setView] = useState<ItemCardView>("grid");
  const [mode, setMode] = useState<SearchMode>("basic");
  const [aiResultIds, setAiResultIds] = useState<string[] | null>(null);
  const [aiPending, startAiTransition] = useTransition();

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

  function handleModeChange(next: SearchMode) {
    if (next === mode) return;
    setMode(next);
    setAiResultIds(null);
  }

  function handleAiSubmit() {
    const trimmed = query.trim();
    if (!trimmed || aiPending) return;
    startAiTransition(async () => {
      const ids = await aiSearchItemsAction({
        query: trimmed,
        items: toAiPayload(optimisticItems),
      });
      setAiResultIds(ids);
    });
  }

  const visible = useMemo(() => {
    let filtered: Item[];
    if (mode === "ai") {
      if (aiResultIds === null) {
        filtered = optimisticItems;
      } else {
        const idSet = new Set(aiResultIds);
        filtered = optimisticItems.filter((item) => idSet.has(item.id));
      }
    } else {
      const trimmed = query.trim().toLowerCase();
      filtered = trimmed
        ? optimisticItems.filter((item) => matchesQuery(item, trimmed))
        : optimisticItems;
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }
    if (categoryFilter !== "ALL") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    return [...filtered].sort((a, b) => compareItems(a, b, sortKey));
  }, [
    optimisticItems,
    query,
    sortKey,
    mode,
    aiResultIds,
    statusFilter,
    categoryFilter,
  ]);

  const aiHasNoMatches =
    mode === "ai" && aiResultIds !== null && visible.length === 0;
  const hasActiveQuery = mode === "basic" && query.trim().length > 0;
  const hasActiveFilter = statusFilter !== "ALL" || categoryFilter !== "ALL";
  const noMatches = visible.length === 0;

  const SearchIcon = mode === "ai" ? Sparkles : Search;
  const iconClass = cn(
    "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2",
    mode === "ai" ? "text-brand" : "text-muted-foreground",
    aiPending && "animate-pulse",
  );

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

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full max-w-sm">
            {aiPending ? (
              <Loader2 className="text-brand pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 animate-spin" />
            ) : (
              <SearchIcon className={iconClass} />
            )}
            <Input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (mode === "ai") setAiResultIds(null);
              }}
              onKeyDown={(event) => {
                if (mode === "ai" && event.key === "Enter") {
                  event.preventDefault();
                  handleAiSubmit();
                }
              }}
              disabled={aiPending}
              placeholder={
                mode === "ai"
                  ? "Describe what you need and press Enter"
                  : "Search hardware..."
              }
              aria-label={
                mode === "ai" ? "AI search hardware" : "Search hardware"
              }
              className="h-9 pl-9"
            />
          </div>

          <ButtonGroup aria-label="Search mode">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleModeChange("basic")}
              className={cn(mode === "basic" && FILTER_ACTIVE_BUTTON)}
              aria-pressed={mode === "basic"}
            >
              <Search />
              Basic
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleModeChange("ai")}
              className={cn(mode === "ai" && FILTER_ACTIVE_BUTTON)}
              aria-pressed={mode === "ai"}
            >
              <Sparkles />
              AI
            </Button>
          </ButtonGroup>

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

      {noMatches ? (
        <div className="text-muted-foreground border-border rounded-lg border border-dashed p-8 text-center text-sm">
          {aiHasNoMatches
            ? "No AI matches found."
            : hasActiveQuery || hasActiveFilter
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
