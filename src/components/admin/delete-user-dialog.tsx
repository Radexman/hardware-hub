"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteUserAction } from "@/actions/users";
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
import type { UserListItem } from "@/lib/db/users";

export function DeleteUserDialog({
  user,
  isCurrentUser,
}: {
  user: UserListItem;
  isCurrentUser: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const label = user.name ?? user.email;

  function handleOpenChange(next: boolean) {
    if (pending) return;
    setOpen(next);
  }

  function handleConfirm() {
    startTransition(async () => {
      const res = await deleteUserAction({ userId: user.id });
      if (res.success) {
        toast.success(`${label} deleted`);
        setOpen(false);
      } else {
        toast.error("Could not delete user", { description: res.error });
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
            aria-label={`Delete ${label}`}
            title={
              isCurrentUser
                ? "You can't delete your own account"
                : "Delete user"
            }
            disabled={isCurrentUser}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 />
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete user</AlertDialogTitle>
          <AlertDialogDescription>
            Permanently delete{" "}
            <span className="text-foreground font-medium">{label}</span>? This
            action cannot be undone.
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
