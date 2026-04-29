import type { ReactNode } from "react";
import { AlertTriangle, Calendar, Clock } from "lucide-react";

import type { Item, ItemStatus } from "@/lib/mock-data";
import type { DueState } from "@/lib/rental-status";
import { cn } from "@/lib/utils";

export type ItemCardView = "grid" | "list";

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

const STATUS_BORDER: Record<ItemStatus, string> = {
  AVAILABLE: "border-l-green-400",
  IN_USE: "border-l-yellow-400",
  REPAIR: "border-l-red-400",
};

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(value: string | null): string {
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

function DueLine({ due, state = "normal" }: { due: string; state?: DueState }) {
  const Icon = state === "overdue" ? AlertTriangle : Clock;
  const label =
    state === "overdue"
      ? "Overdue"
      : state === "due-soon"
        ? "Due soon"
        : "Due";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        state === "normal" && "text-foreground",
        state === "due-soon" && "text-yellow-400",
        state === "overdue" && "text-red-400 animate-pulse",
      )}
    >
      <Icon className="size-3.5" />
      {label} · {formatDate(due)}
    </span>
  );
}

const CARD_BASE =
  "bg-card text-card-foreground border-border rounded-lg border border-l-4 transition-all duration-200";

type CommonProps = {
  item: Item;
  due?: string | null;
  dueState?: DueState;
  showAssignee?: boolean;
  action?: ReactNode;
};

function GridCard({
  item,
  due,
  dueState,
  showAssignee = true,
  action,
}: CommonProps) {
  return (
    <article
      className={cn(
        CARD_BASE,
        "flex flex-col gap-4 p-5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40",
        STATUS_BORDER[item.status],
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-tight">{item.name}</h3>
        <StatusBadge status={item.status} />
      </header>

      <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        <span className="text-foreground text-sm font-medium">
          {item.brand}
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="size-3.5" />
          {formatDate(item.purchaseDate)}
        </span>
      </div>

      {due ? <DueLine due={due} state={dueState} /> : null}

      {(showAssignee && item.assignedTo) || item.notes ? (
        <div className="flex flex-col gap-2">
          {showAssignee && item.assignedTo ? (
            <p className="text-xs">
              <span className="text-muted-foreground">Assigned to: </span>
              <span className="text-brand">{item.assignedTo}</span>
            </p>
          ) : null}
          {item.notes ? (
            <p className="bg-background/40 text-muted-foreground rounded-md border border-white/5 px-3 py-2 text-xs">
              {item.notes}
            </p>
          ) : null}
        </div>
      ) : null}

      {action ? <div className="mt-auto pt-1">{action}</div> : null}
    </article>
  );
}

function ListCard({
  item,
  due,
  dueState,
  showAssignee = true,
  action,
}: CommonProps) {
  return (
    <article
      className={cn(
        CARD_BASE,
        "flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 hover:shadow-md hover:shadow-black/30 sm:flex-nowrap",
        STATUS_BORDER[item.status],
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="truncate text-sm font-semibold">{item.name}</h3>
          <span className="text-muted-foreground text-xs">{item.brand}</span>
          <span className="text-muted-foreground/40 text-xs">·</span>
          <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
            <Calendar className="size-3.5" />
            {formatDate(item.purchaseDate)}
          </span>
          {showAssignee && item.assignedTo ? (
            <>
              <span className="text-muted-foreground/40 text-xs">·</span>
              <span className="text-xs">
                <span className="text-muted-foreground">Assigned to </span>
                <span className="text-brand">{item.assignedTo}</span>
              </span>
            </>
          ) : null}
          {due ? (
            <>
              <span className="text-muted-foreground/40 text-xs">·</span>
              <DueLine due={due} state={dueState} />
            </>
          ) : null}
        </div>
        {item.notes ? (
          <p className="text-muted-foreground mt-1 truncate text-xs">
            {item.notes}
          </p>
        ) : null}
      </div>

      <StatusBadge status={item.status} />

      {action}
    </article>
  );
}

export function ItemCard({
  item,
  view = "grid",
  due,
  dueState,
  showAssignee,
  action,
}: CommonProps & { view?: ItemCardView }) {
  return view === "list" ? (
    <ListCard
      item={item}
      due={due}
      dueState={dueState}
      showAssignee={showAssignee}
      action={action}
    />
  ) : (
    <GridCard
      item={item}
      due={due}
      dueState={dueState}
      showAssignee={showAssignee}
      action={action}
    />
  );
}
