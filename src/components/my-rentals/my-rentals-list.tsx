"use client";

import { useState } from "react";

import { ItemCard, type ItemCardView } from "@/components/items/item-card";
import { ReturnButton } from "@/components/items/actions";
import { ViewToggle } from "@/components/items/view-toggle";
import type { Item } from "@/lib/mock-data";

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

        <ViewToggle value={view} onChange={setView} />
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
              showAssignee={false}
              action={<ReturnButton />}
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
              showAssignee={false}
              action={<ReturnButton />}
            />
          ))}
        </div>
      )}
    </div>
  );
}
