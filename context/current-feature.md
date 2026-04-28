# Current Feature: My Rentals UI Page

Build the `/my-rentals` page UI showing the current user's currently rented items, with the same grid/list view toggle pattern as the hardware list and a (no-op) Return button on each card. Extract the item-view components into a reusable layer so hardware list, my rentals, and the future admin panel can all share them.

## Status

In Progress

## Goals

- Add a `/my-rentals` route with the dashboard layout (sidebar + main slot already shared via the dashboard segment)
- Add a `getMyRentals(userEmail)` (or similar) data-fetching function in `src/lib/db/` that returns the currently-rented items for a given user — items where `assignedTo = email` AND `status = IN_USE`
- Page is an async server component that fetches the current user's rentals and renders them
- Reusable item-view layer: extract the visual `ItemCard` (grid + list variants) and the view-mode toggle into shared components under `src/components/items/` so hardware list, my rentals, and future admin panel can reuse them
- Refactor `HardwareList` to use the shared components without visual regressions
- Two display modes (grid + list) on My Rentals via the shared view toggle
- Each rented card shows the return deadline and a Return button that does nothing (placeholder for the future rent/return server action)

## Notes

- **No auth yet.** "Current user" needs a stand-in. Default plan: hardcode `j.doe@booksy.com` (a seeded user with `item_2` rented) as the current user via a single helper like `getCurrentUserEmail()` in `src/lib/auth.ts` (or inline in the page). Replace once NextAuth lands. Confirm at start.
- Reusable components — proposed layout under `src/components/items/`:
    - `item-card.tsx` — current grid/list `ItemCard` moved here, made action-agnostic via an optional `action?: ReactNode` slot (callers pass `<RentButton />` or `<ReturnButton />`)
    - `item-view-toggle.tsx` — segmented grid/list `ButtonGroup`
    - `item-grid.tsx` / `item-list.tsx` (optional) — small render helpers if it removes duplication; otherwise keep grid/list rendering inline at each call site
- The existing `dashboard/item-card.tsx` would either move or be deleted in favor of the shared component. `dashboard/hardware-list.tsx` becomes a thin client wrapper that owns search + sort + view + brings its own action (Rent).
- My Rentals does **not** need search or sort per the spec — only the view-mode toggle. Keep it simple.
- Return button must be visible but inert. No Server Action yet, no toast — pure UI.
- Show return deadline on the card prominently when rendering in "rentals" mode (currently the card only shows it implicitly via the underlying data). Decide at start: extend the card with an optional "deadline" line, or pass it through `notes`-like prop. Default: small extension to the card, conditionally shown when `returnDate` is set and `view === "list"` or "grid".
- Server component should opt into dynamic rendering (`export const dynamic = "force-dynamic"`) like the dashboard does, since rentals are user-specific and live.
- Out of scope: actual Return action (CRUD), pagination, filters, return-deadline-pulse animation, NextAuth wiring, "no rentals" empty-state copy beyond a basic message.
- The `My Rentals` sidebar nav link already exists in `AppSidebar`; we only need to make the route real.

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-04-27 — Initial setup of Next.js 16 (App Router) with React 19, TypeScript, Tailwind CSS v4, ESLint v9 (flat config), and Vitest test scripts scaffolded.
- 2026-04-27 — Dashboard UI Phase 1: initialized shadcn/ui (components.json, theme tokens in globals.css, lib/utils, button primitive), defaulted the app to dark mode, and added the `/dashboard` route with sidebar + main layout placeholders.
- 2026-04-27 — Dashboard UI Phase 2: added shadcn sidebar/sheet/avatar/tooltip primitives, built `AppSidebar` (Hardware Hub header logo, three nav links with collapsed-icon tooltips, user footer from mock-data + logout placeholder), wired `SidebarProvider`/`TooltipProvider` into the dashboard layout with a mobile-only `SidebarTrigger` (drawer below 768px), and refactored `useIsMobile` to `useSyncExternalStore`.
- 2026-04-27 — Dashboard UI Phase 3: populated `/dashboard` with the hardware list view — `ItemCard` (name + color-coded status badge, brand, formatted purchase date, optional assignee + notes) and `HardwareList` client component owning case-insensitive substring search across name/brand/notes plus Name/Brand/Date/Status sort buttons, rendered in a responsive 1/2/3-col grid from mock items.
- 2026-04-27 — Refined UI: swapped Geist Mono → JetBrains Mono and renamed font CSS variables to `--font-sans`/`--font-mono` (headings now mono); added a `--brand` cyan-400 token and applied `text-brand`/`bg-brand` to the logo, search icon, avatar fallback, active sort button, assigned-to email, and Rent button; replaced `SidebarRail` with an explicit `SidebarTrigger` in the sidebar header; ItemCard gained a per-status right-edge stripe (`border-r-4`), subtle hover lift + shadow, and a decorative Rent button on AVAILABLE items only.
- 2026-04-27 — Item Cards: added shadcn `button-group` primitive; flipped the per-status card stripe from the right edge to the left edge; regrouped grid-card content into header / meta / body / action sections with `mt-auto` Rent for cross-card alignment; introduced a `view` prop on `ItemCard` plus a list-row layout (inline name · brand · date · assigned with truncated notes underneath); converted the sort controls into a segmented `ButtonGroup` and added a `LayoutGrid` / `List` view-mode toggle on the right of the toolbar with active state in the cyan brand color.
- 2026-04-28 — Prisma + Neon Postgres: installed Prisma 7 with the new `prisma-client` generator (output to `src/generated/prisma`, gitignored) + `@prisma/adapter-neon` over `@neondatabase/serverless`; added `prisma.config.ts` reading `DATABASE_URL` from `.env`; authored the initial schema (User, Item, RentalHistory + Role/ItemStatus/RentalAction enums, NextAuth Account/Session/VerificationToken, indexes, cascade deletes); created `src/lib/prisma.ts` with a globalThis singleton; bumped `tsconfig` `target` to ES2023; generated and applied the `init` migration to the Neon dev branch.
- 2026-04-28 — Database Seed: wired `migrations.seed` in `prisma.config.ts` to `tsx prisma/seed.ts`; added `bcryptjs` (12-round hashing); authored an idempotent `prisma/seed.ts` that upserts admin (`admin@booksy.com`), `j.doe@booksy.com`, and `a.smith@booksy.com` (added so item_10 and existing rental history FKs resolve), then upserts all 11 mock items and 5 rental history entries from `src/lib/mock-data.ts` using their stable string IDs.
- 2026-04-28 — Dashboard Items from DB: added `src/lib/db/items.ts` with `getItems()` that pulls items from Prisma (`orderBy: name asc`) and serializes `purchaseDate`/`returnDate` to ISO date strings to keep the existing `Item` type contract; converted `/dashboard/page.tsx` to an async server component awaiting `getItems()` with `export const dynamic = "force-dynamic"` so each request re-queries Neon; left `mock-data.ts`, `HardwareList`, and `ItemCard` untouched.
