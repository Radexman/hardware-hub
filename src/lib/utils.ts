import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Shared "active" treatment for segmented toggles (sort filters, search mode).
// Cyan-tinted text + cyan border, no solid fill — acts as a coloured label.
export const FILTER_ACTIVE_BUTTON =
  "text-brand border-brand bg-background hover:text-brand hover:bg-muted/50"
