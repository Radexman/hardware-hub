"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { updateUserAction } from "@/actions/users";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserListItem } from "@/lib/db/users";

const ROLES = ["USER", "ADMIN"] as const;

const ROLE_LABEL: Record<(typeof ROLES)[number], string> = {
  USER: "User",
  ADMIN: "Admin",
};

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  role: z.enum(ROLES),
});

type FormValues = z.infer<typeof formSchema>;

const fieldError = "text-destructive mt-1 text-xs";

export function EditUserDialog({ user }: { user: UserListItem }) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const defaults: FormValues = {
    name: user.name ?? "",
    role: user.role,
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaults,
  });

  async function onSubmit(values: FormValues) {
    const res = await updateUserAction({
      userId: user.id,
      name: values.name,
      role: values.role,
    });
    if (res.success) {
      toast.success(`${values.name} updated`, { description: user.email });
      handleOpenChange(false);
    } else {
      toast.error("Could not update user", { description: res.error });
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      reset(defaults);
      setFormKey((k) => k + 1);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label={`Edit ${user.name ?? user.email}`}
            title="Edit user"
          >
            <Pencil />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>{user.email}</DialogDescription>
        </DialogHeader>

        <form
          key={formKey}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 py-2"
          noValidate
        >
          <div>
            <Label htmlFor="edit-user-name">Name</Label>
            <Input
              id="edit-user-name"
              placeholder="Jane Doe"
              autoComplete="name"
              aria-invalid={errors.name ? true : undefined}
              {...register("name")}
            />
            {errors.name ? (
              <p className={fieldError}>{errors.name.message}</p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="edit-user-role">Role</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="edit-user-role" className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {ROLE_LABEL[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role ? (
              <p className={fieldError}>{errors.role.message}</p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
