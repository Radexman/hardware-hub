import { Calendar } from "lucide-react";

import type { Item, ItemStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<ItemStatus, string> = {
  AVAILABLE: "Available",
  IN_USE: "In Use",
  REPAIR: "Repair",
};

const STATUS_STYLES: Record<ItemStatus, string> = {
  AVAILABLE: "bg-green-400/10 text-green-400 ring-green-400/20",
  IN_USE: "bg-yellow-400/10 text-yellow-400 ring-yellow-400/20",
  REPAIR: "bg-red-400/10 text-red-400 ring-red-400/20",
};

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatPurchaseDate(value: string | null): string {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return DATE_FMT.format(date);
}

function StatusBadge({ status }: { status: ItemStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        STATUS_STYLES[status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function ItemCard({ item }: { item: Item }) {
  return (
    <article className="bg-card text-card-foreground border-border flex flex-col gap-3 rounded-lg border p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-tight">{item.name}</h3>
        <StatusBadge status={item.status} />
      </div>

      <div className="text-muted-foreground text-sm">{item.brand}</div>

      <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
        <Calendar className="size-3.5" />
        {formatPurchaseDate(item.purchaseDate)}
      </div>

      {item.assignedTo ? (
        <div className="text-xs">
          <span className="text-muted-foreground">Assigned to: </span>
          <span className="text-accent">{item.assignedTo}</span>
        </div>
      ) : null}

      {item.notes ? (
        <div className="bg-background/40 text-muted-foreground rounded-md border border-white/5 px-3 py-2 text-xs">
          {item.notes}
        </div>
      ) : null}
    </article>
  );
}
