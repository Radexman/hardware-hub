import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

export function AdminUserActions() {
  return (
    <ButtonGroup aria-label="User actions">
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label="Edit"
        title="Edit (coming soon)"
        disabled
      >
        <Pencil />
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
