import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Shared "active" treatment for segmented toggles (sort filters, search mode).
// Cyan-tinted text + cyan border, no solid fill — acts as a coloured label.
export const FILTER_ACTIVE_BUTTON =
  "text-brand border-brand bg-background hover:text-brand hover:bg-muted/50"

// Shared "active" treatment for segmented selectors that should fill solid
// brand cyan when active (rent-period picker, view-mode toggle, etc.).
// dark: variants are required because the outline button variant carries
// `dark:bg-input/30` which would otherwise win the cascade in dark mode.
export const ACTIVE_BUTTON_BRAND =
  "bg-brand text-brand-foreground border-brand hover:bg-brand/90 hover:text-brand-foreground dark:bg-brand dark:border-brand dark:hover:bg-brand/90"
