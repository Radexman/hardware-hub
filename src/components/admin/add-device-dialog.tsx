"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const STATUSES = ["AVAILABLE", "IN_USE", "REPAIR"] as const;

const STATUS_LABEL: Record<(typeof STATUSES)[number], string> = {
  AVAILABLE: "Available",
  IN_USE: "In Use",
  REPAIR: "Repair",
};

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  brand: z.string().trim().min(1, "Brand is required"),
  purchaseDate: z.string().trim().min(1, "Purchase date is required"),
  status: z.enum(STATUSES),
  notes: z.string().trim().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const fieldError = "text-destructive mt-1 text-xs";

export function AddDeviceDialog({ brandOptions }: { brandOptions: string[] }) {
  const [open, setOpen] = useState(false);

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
      brand: "",
      purchaseDate: "",
      status: "AVAILABLE",
      notes: "",
    },
  });

  function onSubmit(values: FormValues) {
    console.log("[AddDeviceDialog] submit", values);
    reset();
    setOpen(false);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) reset();
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
            <Plus />
            Add Device
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add device</DialogTitle>
          <DialogDescription>
            Register a new piece of hardware. Submission will be logged for now.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div>
            <Label htmlFor="device-name">Name</Label>
            <Input
              id="device-name"
              placeholder="Apple MacBook Pro 14"
              autoComplete="off"
              aria-invalid={errors.name ? true : undefined}
              {...register("name")}
            />
            {errors.name ? (
              <p className={fieldError}>{errors.name.message}</p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="device-brand">Brand</Label>
            <Controller
              control={control}
              name="brand"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="device-brand" className="w-full">
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brandOptions.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.brand ? (
              <p className={fieldError}>{errors.brand.message}</p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="device-purchase-date">Purchase date</Label>
            <Input
              id="device-purchase-date"
              type="date"
              aria-invalid={errors.purchaseDate ? true : undefined}
              {...register("purchaseDate")}
            />
            {errors.purchaseDate ? (
              <p className={fieldError}>{errors.purchaseDate.message}</p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="device-status">Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="device-status" className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {STATUS_LABEL[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status ? (
              <p className={fieldError}>{errors.status.message}</p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="device-notes">Notes</Label>
            <Textarea
              id="device-notes"
              rows={3}
              placeholder="Damage history, warnings, etc. (optional)"
              {...register("notes")}
            />
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
              className={cn(
                "bg-brand text-brand-foreground hover:bg-brand/90",
              )}
            >
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
