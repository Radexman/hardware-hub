# Current Feature: Refined UI

A polish pass over the dashboard — bring fonts, primary color, sidebar interactions, and card visuals in line with the original screenshots, and add a decorative Rent action on Available cards.

## Status

In Progress

## Goals

- Implement the fonts from the original design (project-overview calls for **JetBrains Mono** on display / headings / mono and **Geist Sans** on body — currently `next/font/google` loads Geist + Geist Mono, so the mono pair needs swapping)
- Replace the current "click the separator to collapse" affordance (`SidebarRail`) with an explicit collapse icon button inside the sidebar
- Pick a new primary color for the app and apply it to the sidebar logo icon and the Search Hardware searchbar icon (everywhere `text-accent` is used today on those two spots)
- On each `ItemCard`, render a right-edge border in the current status color (green / yellow / red) for at-a-glance status recognition
- Add subtle hover effects to item cards (project-overview hints: "subtle scale + shadow lift")
- Show a Rent button on cards whose status is `AVAILABLE` only — purely decorative for now, no real rent action wired

## Notes

- Visual references: `@context/screenshots/user-hardware-list.png`, `@context/screenshots/user-my-rentals.png`, `@context/screenshots/admin-panel.png`, `@context/screenshots/login.png`. Worth scanning all four before starting since some cues (e.g. exact accent color tone, button style) are easier to read off the login/admin screens.
- Project-overview design reference: `@context/project-overview.md` (color tokens, typography table, layout sketches).
- Mock data unchanged: `@src/lib/mock-data.ts`.
- For the **primary color**: project-overview's spec already calls for `--accent: #22d3ee` (cyan-400). The screenshots also show a cyan accent. Suggest landing on cyan-400 unless the user has a different preference. The new color should replace shadcn's stock neutral accent token in `globals.css` so any future component using `text-accent` / `bg-accent` picks it up automatically.
- For the **collapse icon**: shadcn's `SidebarTrigger` is the canonical button (it already toggles via `useSidebar`). Mount it inside the sidebar (likely in `SidebarHeader` next to the Hardware Hub title, or in the footer) and drop the `SidebarRail` from `AppSidebar`.
- For the **status border**: the existing `STATUS_STYLES` map in `item-card.tsx` already encodes per-status colors — extend it (or pair it with a second map) to also drive a `border-r-4` color on the card.
- For the **Rent button**: keep it inert (`onClick` no-op or omitted). Use Lucide's `ArrowRightLeft` per project-overview icon mapping. Render it only when `item.status === "AVAILABLE"`.
- Tailwind v4 — theme config in `src/app/globals.css` via `@theme`. Do NOT create `tailwind.config.{ts,js}`. The accent color change is a one-line tweak to the `:root` and `.dark` blocks in `globals.css`.

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-04-27 — Initial setup of Next.js 16 (App Router) with React 19, TypeScript, Tailwind CSS v4, ESLint v9 (flat config), and Vitest test scripts scaffolded.
- 2026-04-27 — Dashboard UI Phase 1: initialized shadcn/ui (components.json, theme tokens in globals.css, lib/utils, button primitive), defaulted the app to dark mode, and added the `/dashboard` route with sidebar + main layout placeholders.
- 2026-04-27 — Dashboard UI Phase 2: added shadcn sidebar/sheet/avatar/tooltip primitives, built `AppSidebar` (Hardware Hub header logo, three nav links with collapsed-icon tooltips, user footer from mock-data + logout placeholder), wired `SidebarProvider`/`TooltipProvider` into the dashboard layout with a mobile-only `SidebarTrigger` (drawer below 768px), and refactored `useIsMobile` to `useSyncExternalStore`.
- 2026-04-27 — Dashboard UI Phase 3: populated `/dashboard` with the hardware list view — `ItemCard` (name + color-coded status badge, brand, formatted purchase date, optional assignee + notes) and `HardwareList` client component owning case-insensitive substring search across name/brand/notes plus Name/Brand/Date/Status sort buttons, rendered in a responsive 1/2/3-col grid from mock items.
