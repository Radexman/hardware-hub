"use client";

import { useState, useTransition } from "react";
import { ArrowRightLeft, Calendar } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ActionResult } from "@/actions/rentals";
import type { Item } from "@/lib/mock-data";
import {
  DEFAULT_RENTAL_PERIOD_DAYS,
  RENTAL_PERIOD_OPTIONS,
  addDays,
  type RentalPeriodDays,
} from "@/lib/rental-status";
import { ACTIVE_BUTTON_BRAND, cn } from "@/lib/utils";

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function RentDialog({
  item,
  onConfirm,
}: {
  item: Item;
  onConfirm: (rentalDays: RentalPeriodDays) => Promise<ActionResult>;
}) {
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState<RentalPeriodDays>(DEFAULT_RENTAL_PERIOD_DAYS);
  const [pending, startTransition] = useTransition();

  const projectedReturn = DATE_FMT.format(addDays(new Date(), days));

  function handleOpenChange(next: boolean) {
    if (pending) return;
    setOpen(next);
    if (!next) setDays(DEFAULT_RENTAL_PERIOD_DAYS);
  }

  function handleConfirm() {
    setOpen(false);
    startTransition(async () => {
      const res = await onConfirm(days);
      if (res.success) {
        toast.success(`${item.name} rented`, {
          description: `Due ${DATE_FMT.format(addDays(new Date(), days))}`,
        });
      } else {
        toast.error("Rental failed", { description: res.error });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            type="button"
            size="sm"
            disabled={pending}
            className="bg-brand text-brand-foreground hover:bg-brand/90"
          >
            <ArrowRightLeft />
            Rent
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rent {item.name}</DialogTitle>
          <DialogDescription>{item.brand} · Available</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            Return in
          </span>
          <ButtonGroup>
            {RENTAL_PERIOD_OPTIONS.map((opt) => {
              const isActive = opt === days;
              return (
                <Button
                  key={opt}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDays(opt)}
                  className={cn(isActive && ACTIVE_BUTTON_BRAND)}
                  aria-pressed={isActive}
                >
                  {opt} days
                </Button>
              );
            })}
          </ButtonGroup>
          <p className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
            <Calendar className="size-3.5" />
            Returns by {projectedReturn}
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="bg-brand text-brand-foreground hover:bg-brand/90"
          >
            <ArrowRightLeft />
            Confirm Rent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
