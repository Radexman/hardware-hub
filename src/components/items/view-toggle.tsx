"use client";

import { LayoutGrid, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ACTIVE_BUTTON_BRAND, cn } from "@/lib/utils";

export type ViewMode = "grid" | "list";

export function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (next: ViewMode) => void;
}) {
  return (
    <ButtonGroup aria-label="View mode">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange("grid")}
        aria-pressed={value === "grid"}
        aria-label="Grid view"
        className={cn(value === "grid" && ACTIVE_BUTTON_BRAND)}
      >
        <LayoutGrid />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange("list")}
        aria-pressed={value === "list"}
        aria-label="List view"
        className={cn(value === "list" && ACTIVE_BUTTON_BRAND)}
      >
        <List />
      </Button>
    </ButtonGroup>
  );
}
