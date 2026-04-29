"use client";

import { useState, useTransition } from "react";
import { ArrowRightLeft, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { rentItemAction, returnItemAction } from "@/actions/rentals";

type ItemActionProps = { itemId: string };

export function RentButton({ itemId }: ItemActionProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        size="sm"
        disabled={pending}
        className="bg-brand text-brand-foreground hover:bg-brand/90"
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const res = await rentItemAction({ itemId });
            if (!res.success) setError(res.error);
          });
        }}
      >
        <ArrowRightLeft />
        {pending ? "Renting..." : "Rent"}
      </Button>
      {error ? (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ReturnButton({ itemId }: ItemActionProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const res = await returnItemAction({ itemId });
            if (!res.success) setError(res.error);
          });
        }}
      >
        <Undo2 />
        {pending ? "Returning..." : "Return"}
      </Button>
      {error ? (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
