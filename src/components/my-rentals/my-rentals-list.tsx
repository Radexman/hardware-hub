"use client";

import { useOptimistic, useState } from "react";

import { returnItemAction, type ActionResult } from "@/actions/rentals";
import { ItemCard, type ItemCardView } from "@/components/items/item-card";
import { ReturnDialog } from "@/components/items/return-dialog";
import { ViewToggle } from "@/components/items/view-toggle";
import type { Item } from "@/lib/mock-data";
import { classifyDue } from "@/lib/rental-status";

export function MyRentalsList({ items }: { items: Item[] }) {
  const [view, setView] = useState<ItemCardView>("grid");

  const [optimisticItems, removeReturned] = useOptimistic<Item[], string>(
    items,
    (state, returnedId) => state.filter((item) => item.id !== returnedId),
  );

  async function handleReturn(itemId: string): Promise<ActionResult> {
    removeReturned(itemId);
    return returnItemAction({ itemId });
  }

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
          {optimisticItems.length}{" "}
          {optimisticItems.length === 1 ? "item" : "items"}
        </span>

        <ViewToggle value={view} onChange={setView} />
      </div>

      {optimisticItems.length === 0 ? (
        <div className="text-muted-foreground border-border rounded-lg border border-dashed p-8 text-center text-sm">
          You have no active rentals.
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {optimisticItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              view="grid"
              due={item.returnDate}
              dueState={classifyDue(item.returnDate)}
              showAssignee={false}
              action={
                <ReturnDialog
                  item={item}
                  onConfirm={() => handleReturn(item.id)}
                />
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {optimisticItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              view="list"
              due={item.returnDate}
              dueState={classifyDue(item.returnDate)}
              showAssignee={false}
              action={
                <ReturnDialog
                  item={item}
                  onConfirm={() => handleReturn(item.id)}
                />
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
