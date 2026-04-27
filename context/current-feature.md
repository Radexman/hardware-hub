# Current Feature: Item Cards

A second pass on the hardware list — restructure the cards, move the status stripe, add a grid/list view toggle, and convert the sort controls to a shadcn button group.

## Status

In Progress

## Goals

- Reorganize the content inside each item card for a clearer visual hierarchy and more comfortable spacing
- Move the per-status colored stripe from the **right** edge to the **left** edge of the card
- Support two view modes for the hardware list — a grid (existing) and a list/row layout (new), with a Google-Drive-style icon toggle
- Make sure the "Assigned to" email and the Rent button are styled in the cyan brand color (verify both — Rent already is, "Assigned to" was switched to `text-brand` last pass; confirm it still reads as cyan after the layout changes)
- Convert the Name / Brand / Date / Status sort controls into a shadcn `ButtonGroup` (segmented look — no horizontal gap between buttons, no extra horizontal padding)
- Active sort button (and active view-mode toggle) renders in cyan brand color

## Notes

- Visual references: `@context/screenshots/user-hardware-list.png`, `@context/screenshots/user-my-rentals.png`, `@context/screenshots/admin-panel.png`.
- Project-overview design reference: `@context/project-overview.md`.
- Mock data unchanged: `@src/lib/mock-data.ts`.
- ButtonGroup docs: https://ui.shadcn.com/docs/components/radix/button-group — install with `npx shadcn@latest add button-group`. Same registry pattern as the rest of our shadcn primitives.
- "Cyan" = the existing `--brand` token added in the previous Refined UI pass (cyan-400). Use `bg-brand text-brand-foreground` for filled active state, `text-brand` for the assigned-to email and other accent text. No new color tokens needed.
- For the **status stripe move**: the current `STATUS_BORDER` map in `item-card.tsx` uses `border-r-{color}` + `border-r-4` — flip both to the left edge (`border-l-{color}` + `border-l-4`). Hover transform must not overwrite the left border-color.
- For the **two view modes**: lift `viewMode: "grid" | "list"` state into `HardwareList`, render either `<ItemCard>` in the existing responsive grid or a list row variant. Either ship a single `ItemCard` that takes a `view` prop and renders both layouts, or split into `ItemCardGrid` + `ItemCardRow`. Single component with a discriminated layout is simpler and avoids drift on shared concerns (status badge, formatting helpers).
- For the **list mode layout**: per the screenshots, a list row reads left-to-right as `[stripe] name · brand · date · assigned · status · rent` — single line on desktop, can wrap on narrow widths. The status stripe still belongs on the left edge of the row.
- For the **view-mode toggle**: a tiny ButtonGroup of two icon buttons (`LayoutGrid` + `List` from lucide) sitting near the sort controls (top-right of the toolbar) is the Drive-style affordance.
- For the **content reorg in the card**: the current order (name/badge, brand, date, assigned, notes, rent) works but feels stacked-flat. Worth grouping: header row (name + status badge), small meta line (brand · date), optional assigned line, optional notes box, action row at the bottom. Use `gap-y` rather than uniform `gap-3` so groups breathe.
- Tailwind v4 — theme config in `src/app/globals.css` via `@theme`. Do NOT create `tailwind.config.{ts,js}`.

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-04-27 — Initial setup of Next.js 16 (App Router) with React 19, TypeScript, Tailwind CSS v4, ESLint v9 (flat config), and Vitest test scripts scaffolded.
- 2026-04-27 — Dashboard UI Phase 1: initialized shadcn/ui (components.json, theme tokens in globals.css, lib/utils, button primitive), defaulted the app to dark mode, and added the `/dashboard` route with sidebar + main layout placeholders.
- 2026-04-27 — Dashboard UI Phase 2: added shadcn sidebar/sheet/avatar/tooltip primitives, built `AppSidebar` (Hardware Hub header logo, three nav links with collapsed-icon tooltips, user footer from mock-data + logout placeholder), wired `SidebarProvider`/`TooltipProvider` into the dashboard layout with a mobile-only `SidebarTrigger` (drawer below 768px), and refactored `useIsMobile` to `useSyncExternalStore`.
- 2026-04-27 — Dashboard UI Phase 3: populated `/dashboard` with the hardware list view — `ItemCard` (name + color-coded status badge, brand, formatted purchase date, optional assignee + notes) and `HardwareList` client component owning case-insensitive substring search across name/brand/notes plus Name/Brand/Date/Status sort buttons, rendered in a responsive 1/2/3-col grid from mock items.
- 2026-04-27 — Refined UI: swapped Geist Mono → JetBrains Mono and renamed font CSS variables to `--font-sans`/`--font-mono` (headings now mono); added a `--brand` cyan-400 token and applied `text-brand`/`bg-brand` to the logo, search icon, avatar fallback, active sort button, assigned-to email, and Rent button; replaced `SidebarRail` with an explicit `SidebarTrigger` in the sidebar header; ItemCard gained a per-status right-edge stripe (`border-r-4`), subtle hover lift + shadow, and a decorative Rent button on AVAILABLE items only.
