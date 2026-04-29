"use client";

import { useTransition } from "react";
import { Trash2, Wrench } from "lucide-react";
import { toast } from "sonner";

import { toggleRepairAction } from "@/actions/items";
import { EditDeviceDialog } from "@/components/admin/edit-device-dialog";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import type { Item } from "@/lib/mock-data";

export function AdminItemActions({
  item,
  brandOptions,
}: {
  item: Item;
  brandOptions: string[];
}) {
  const [pending, startTransition] = useTransition();
  const inUse = item.status === "IN_USE";

  const repairLabel =
    item.status === "REPAIR" ? "Mark available" : "Send to repair";

  function handleToggleRepair() {
    startTransition(async () => {
      const res = await toggleRepairAction({ itemId: item.id });
      if (res.success) {
        toast.success(
          res.data.status === "REPAIR"
            ? `${item.name} sent to repair`
            : `${item.name} back in service`,
        );
      } else {
        toast.error("Could not toggle repair", { description: res.error });
      }
    });
  }

  return (
    <ButtonGroup aria-label="Item actions">
      <EditDeviceDialog item={item} brandOptions={brandOptions} />
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label={repairLabel}
        title={inUse ? "Items in use cannot enter repair" : repairLabel}
        disabled={inUse || pending}
        onClick={handleToggleRepair}
      >
        <Wrench />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label="Delete"
        title="Delete (coming soon)"
        disabled
      >
        <Trash2 />
      </Button>
    </ButtonGroup>
  );
}
