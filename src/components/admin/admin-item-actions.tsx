import { Pencil, Trash2, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

export function AdminItemActions() {
  return (
    <ButtonGroup aria-label="Item actions">
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
        aria-label="Toggle repair"
        title="Toggle repair (coming soon)"
        disabled
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
