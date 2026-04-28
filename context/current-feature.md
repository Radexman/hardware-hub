# Current Feature: Dashboard Items from Database

Replace the mock items powering the dashboard's main list with real items fetched from Neon via Prisma. UI stays exactly as it is.

## Status

In Progress

## Goals

- Add `src/lib/db/items.ts` with a server-side data-fetching function (e.g. `getItems()`) that returns the items the dashboard needs
- Fetch items directly in the `/dashboard` server component and pass them to `HardwareList` (no client-side fetch, no Server Action, since we're rendering on initial load)
- Preserve current dashboard look + behavior — `ItemCard` and `HardwareList` should not need visible changes
- Switch the dashboard's data source from `@/lib/mock-data` to the new DB function while leaving the rest of `mock-data.ts` (e.g. `currentUser`, `rentalHistory`) alone for now

## Notes

- Prisma returns `purchaseDate` and `returnDate` as `Date | null`, while the existing `Item` type in `src/lib/mock-data.ts` (and the components) uses `string | null`. Two options to surface at start: (a) serialize dates to ISO strings inside `getItems()` so the UI types don't change, or (b) update `ItemCard`/`HardwareList` to accept `Date` objects. **Default plan: (a) serialize in the data layer**, smallest blast radius and matches the existing UI contract.
- Status values match (`AVAILABLE | IN_USE | REPAIR`) — the Prisma enum is string-compatible so no mapping needed there.
- The spec says "fetch items directly in the server component", so the dashboard `page.tsx` becomes async and awaits `getItems()`. Don't introduce loading skeletons or Suspense boundaries yet — out of scope.
- The Neon adapter in `src/lib/prisma.ts` already handles connection pooling for serverless. No new infra needed.
- Out of scope: pagination, filtering on the server, AI search, write actions (rent/return). The page still renders all items unsorted/unfiltered server-side; the client component owns search/sort/view-toggle as before.
- Don't delete `mock-data.ts` — the sidebar still consumes `currentUser` and we may keep it as a fixture reference. Consider trimming in a later phase.

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
