import { ArrowRightLeft, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function RentButton() {
  return (
    <Button
      type="button"
      size="sm"
      className="bg-brand text-brand-foreground hover:bg-brand/90"
    >
      <ArrowRightLeft />
      Rent
    </Button>
  );
}

export function ReturnButton() {
  return (
    <Button type="button" size="sm" variant="outline">
      <Undo2 />
      Return
    </Button>
  );
}
