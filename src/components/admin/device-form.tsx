"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
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

const EDITABLE_STATUSES = ["AVAILABLE", "REPAIR"] as const;
type EditableStatus = (typeof EDITABLE_STATUSES)[number];

const STATUS_LABEL: Record<EditableStatus | "IN_USE", string> = {
  AVAILABLE: "Available",
  REPAIR: "Repair",
  IN_USE: "In Use",
};

export const deviceFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  brand: z.string().trim().min(1, "Brand is required"),
  purchaseDate: z.string().trim().min(1, "Purchase date is required"),
  status: z.enum(EDITABLE_STATUSES),
  notes: z.string().trim().optional(),
});

export type DeviceFormValues = z.infer<typeof deviceFormSchema>;

const fieldError = "text-destructive mt-1 text-xs";

export type DeviceFormSubmitResult = { success: true } | { success: false; error: string };

export function DeviceForm({
  mode,
  defaultValues,
  brandOptions,
  lockStatus = false,
  onSubmit,
  onCancel,
}: {
  mode: "create" | "edit";
  defaultValues: DeviceFormValues;
  brandOptions: string[];
  lockStatus?: boolean;
  onSubmit: (values: DeviceFormValues) => Promise<DeviceFormSubmitResult>;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceFormSchema),
    defaultValues,
  });

  const submitLabel = mode === "create" ? "Create" : "Save changes";
  const submittingLabel = mode === "create" ? "Creating..." : "Saving...";

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
      className="flex flex-col gap-5 py-2"
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
        {errors.name ? <p className={fieldError}>{errors.name.message}</p> : null}
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
        {lockStatus ? (
          <Input
            id="device-status"
            value={STATUS_LABEL.IN_USE}
            readOnly
            disabled
          />
        ) : (
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="device-status" className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {EDITABLE_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {STATUS_LABEL[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}
        {lockStatus ? (
          <p className="text-muted-foreground mt-1 text-xs">
            Items in use can&apos;t change status here. Have the renter return
            it first.
          </p>
        ) : null}
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
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn("bg-brand text-brand-foreground hover:bg-brand/90")}
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
