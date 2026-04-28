"use client";

import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ItemCard, type ItemCardView } from "@/components/my-rentals/item-card";
import type { Item } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const ACTIVE_BUTTON =
  "bg-brand text-brand-foreground border-brand hover:bg-brand/90 hover:text-brand-foreground";

export function MyRentalsList({ items }: { items: Item[] }) {
  const [view, setView] = useState<ItemCardView>("grid");

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-mono text-2xl font-bold tracking-tight">
          My Rentals
        </h1>
        <p className="text-muted-foreground text-sm">
          Equipment you currently have checked out
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>

        <ButtonGroup aria-label="View mode">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setView("grid")}
            aria-pressed={view === "grid"}
            aria-label="Grid view"
            className={cn(view === "grid" && ACTIVE_BUTTON)}
          >
            <LayoutGrid />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            aria-label="List view"
            className={cn(view === "list" && ACTIVE_BUTTON)}
          >
            <List />
          </Button>
        </ButtonGroup>
      </div>

      {items.length === 0 ? (
        <div className="text-muted-foreground border-border rounded-lg border border-dashed p-8 text-center text-sm">
          You have no active rentals.
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              view="grid"
              due={item.returnDate}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              view="list"
              due={item.returnDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
