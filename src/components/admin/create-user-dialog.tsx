"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { createUserAction } from "@/actions/users";
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
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLES = ["USER", "ADMIN"] as const;

const ROLE_LABEL: Record<(typeof ROLES)[number], string> = {
  USER: "User",
  ADMIN: "Admin",
};

const formSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm the password"),
    role: z.enum(ROLES),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

const fieldError = "text-destructive mt-1 text-xs";

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "USER",
    },
  });

  async function onSubmit(values: FormValues) {
    const res = await createUserAction({
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
    });
    if (res.success) {
      toast.success(`${values.name} added`, { description: values.email });
      handleOpenChange(false);
    } else {
      toast.error("Could not create user", { description: res.error });
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      reset();
      setFormKey((k) => k + 1);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            type="button"
            size="sm"
            className="bg-brand text-brand-foreground hover:bg-brand/90"
          >
            <UserPlus />
            Create User
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create user</DialogTitle>
          <DialogDescription>
            Add a new user account.
          </DialogDescription>
        </DialogHeader>

        <form
          key={formKey}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 py-2"
          noValidate
        >
          <div>
            <Label htmlFor="user-name">Name</Label>
            <Input
              id="user-name"
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
            <Label htmlFor="user-email">Email</Label>
            <Input
              id="user-email"
              type="email"
              placeholder="jane@booksy.com"
              autoComplete="email"
              aria-invalid={errors.email ? true : undefined}
              {...register("email")}
            />
            {errors.email ? (
              <p className={fieldError}>{errors.email.message}</p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="user-password">Password</Label>
            <PasswordInput
              id="user-password"
              autoComplete="new-password"
              aria-invalid={errors.password ? true : undefined}
              {...register("password")}
            />
            {errors.password ? (
              <p className={fieldError}>{errors.password.message}</p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="user-confirm-password">Confirm password</Label>
            <PasswordInput
              id="user-confirm-password"
              autoComplete="new-password"
              aria-invalid={errors.confirmPassword ? true : undefined}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword ? (
              <p className={fieldError}>{errors.confirmPassword.message}</p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="user-role">Role</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="user-role" className="w-full">
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
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
