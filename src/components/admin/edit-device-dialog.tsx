"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { updateItemAction } from "@/actions/items";
import {
  DeviceForm,
  type DeviceFormSubmitResult,
  type DeviceFormValues,
} from "@/components/admin/device-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Item } from "@/lib/mock-data";

function defaultsFromItem(item: Item): DeviceFormValues {
  return {
    name: item.name,
    brand: item.brand,
    category: item.category,
    purchaseDate: item.purchaseDate ?? "",
    status: item.status === "REPAIR" ? "REPAIR" : "AVAILABLE",
    notes: item.notes ?? "",
  };
}

export function EditDeviceDialog({
  item,
  brandOptions,
}: {
  item: Item;
  brandOptions: string[];
}) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const lockStatus = item.status === "IN_USE";

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setFormKey((k) => k + 1);
  }

  async function handleSubmit(
    values: DeviceFormValues,
  ): Promise<DeviceFormSubmitResult> {
    const res = await updateItemAction({
      itemId: item.id,
      name: values.name,
      brand: values.brand,
      category: values.category,
      purchaseDate: values.purchaseDate,
      notes: values.notes,
      status: lockStatus ? undefined : values.status,
    });
    if (res.success) {
      toast.success(`${values.name} updated`);
      handleOpenChange(false);
      return { success: true };
    }
    toast.error("Could not save changes", { description: res.error });
    return { success: false, error: res.error };
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label={`Edit ${item.name}`}
            title="Edit"
          >
            <Pencil />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {item.name}</DialogTitle>
          <DialogDescription>{item.brand}</DialogDescription>
        </DialogHeader>

        <DeviceForm
          key={formKey}
          mode="edit"
          defaultValues={defaultsFromItem(item)}
          brandOptions={brandOptions}
          lockStatus={lockStatus}
          onSubmit={handleSubmit}
          onCancel={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
