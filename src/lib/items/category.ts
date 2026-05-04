import {
  Keyboard,
  Laptop,
  Mouse,
  Package,
  Smartphone,
  Tablet,
  type LucideIcon,
} from "lucide-react";

import type { ItemCategory } from "@/lib/mock-data";

export const ITEM_CATEGORIES: ItemCategory[] = [
  "LAPTOP",
  "PHONE",
  "TABLET",
  "MOUSE",
  "KEYBOARD",
  "OTHER",
];

export const ITEM_CATEGORY_LABEL: Record<ItemCategory, string> = {
  LAPTOP: "Laptop",
  PHONE: "Phone",
  TABLET: "Tablet",
  MOUSE: "Mouse",
  KEYBOARD: "Keyboard",
  OTHER: "Other",
};

const ITEM_CATEGORY_ICON: Record<ItemCategory, LucideIcon> = {
  LAPTOP: Laptop,
  PHONE: Smartphone,
  TABLET: Tablet,
  MOUSE: Mouse,
  KEYBOARD: Keyboard,
  OTHER: Package,
};

export function getItemIcon(category: ItemCategory): LucideIcon {
  return ITEM_CATEGORY_ICON[category];
}
