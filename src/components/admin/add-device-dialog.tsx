"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { createItemAction } from "@/actions/items";
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

const DEFAULT_VALUES: DeviceFormValues = {
  name: "",
  brand: "",
  category: "OTHER",
  purchaseDate: "",
  status: "AVAILABLE",
  notes: "",
};

export function AddDeviceDialog({ brandOptions }: { brandOptions: string[] }) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setFormKey((k) => k + 1);
  }

  async function handleSubmit(
    values: DeviceFormValues,
  ): Promise<DeviceFormSubmitResult> {
    const res = await createItemAction({
      name: values.name,
      brand: values.brand,
      category: values.category,
      purchaseDate: values.purchaseDate,
      status: values.status,
      notes: values.notes,
    });
    if (res.success) {
      toast.success(`${values.name} added to inventory`);
      handleOpenChange(false);
      return { success: true };
    }
    toast.error("Could not create device", { description: res.error });
    return { success: false, error: res.error };
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
            Register a new piece of hardware.
          </DialogDescription>
        </DialogHeader>

        <DeviceForm
          key={formKey}
          mode="create"
          defaultValues={DEFAULT_VALUES}
          brandOptions={brandOptions}
          onSubmit={handleSubmit}
          onCancel={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
