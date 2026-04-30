"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteItemAction } from "@/actions/items";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { Item } from "@/lib/mock-data";

export function DeleteDeviceDialog({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const inUse = item.status === "IN_USE";

  function handleOpenChange(next: boolean) {
    if (pending) return;
    setOpen(next);
  }

  function handleConfirm() {
    startTransition(async () => {
      const res = await deleteItemAction({ itemId: item.id });
      if (res.success) {
        toast.success(`${item.name} deleted`);
        setOpen(false);
      } else {
        toast.error("Could not delete device", { description: res.error });
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label={`Delete ${item.name}`}
            title={
              inUse
                ? "Items in use cannot be deleted"
                : "Delete device"
            }
            disabled={inUse}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 />
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Device</AlertDialogTitle>
          <AlertDialogDescription>
            Permanently delete <span className="text-foreground font-medium">{item.name}</span>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={pending}
          >
            <Trash2 />
            {pending ? "Deleting..." : "Confirm Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
