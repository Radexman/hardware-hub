# Current Feature: Admin Panel — Phase 1 (Inventory)

Build the `/admin` route as an inventory-management view that reuses the existing card-based hardware UI (no table). Add a placeholder "Add Device" dialog with a validated form that only logs on submit. All per-card admin actions (Edit / Delete / Toggle Repair) are non-interactive in this phase. User management is out of scope (lands in Phase 2).

## Status

In Progress

## Goals

- Add `/admin` route inside the `(app)` route group so it shares the sidebar layout
- Async server component that fetches all items from the existing Prisma-backed catalogue (`getItems()` from `src/lib/db/items.ts`) — no separate data path
- Render the inventory using the existing card pattern (grid + list view-mode toggle), per-status left border, and the cyan-accent active control styling
- Keep the existing search + Name/Brand/Date/Status sort UX from `HardwareList`
- Per-card admin action affordances: Edit / Delete / Toggle Repair — visual placeholders only in this phase
- "Add Device" cyan button in the admin toolbar that opens a shadcn Dialog
- Form fields: Name (text), Brand (select), Purchase Date (date), Status (select), Notes (textarea, optional). Validation: required fields enforced, status restricted to the enum (`AVAILABLE | IN_USE | REPAIR`)
- Submit handler `console.log`s the validated payload — no persistence yet
- Loading skeleton for the inventory fetch via Suspense boundary
- Install only the shadcn primitives we don't already have: `dialog`, `form`, `input`, `select`, `textarea`, `label` (plus `react-hook-form`, `zod`, `@hookform/resolvers`)

## Notes

- **Reuse vs. duplicate (key decision for `/feature start`).** The spec says "Reuse existing components where possible / Favor composition over duplicated card logic." Three options to surface at start:
    1. **(Recommended) Extract a shared `src/components/items/item-card.tsx`** with an `action?: ReactNode` slot, port the existing dashboard card there, and convert hardware-list, my-rentals, and admin to all use it. Pays the refactor cost once for three consumers.
    2. **Add an admin variant to the existing dashboard card via a discriminated prop** (e.g. `actions: "rent" | "admin"`), and use a separate copy for my-rentals as today. Less moving, but the dashboard card grows special cases.
    3. **Triplicate** — copy the dashboard card again into `src/components/admin/item-card.tsx`. Matches the my-rentals approach but locks in 3x duplication.

  My recommendation is (1) since the spec explicitly favors composition and we now have a third consumer.
- Filters: project-overview lists Status/Brand filters but the current Hardware List does not implement them. The spec says "Keep current search/filter UX" — so keep the current behavior (search input + Name/Brand/Date/Status sort) and don't introduce filter dropdowns in this phase. Confirm at start.
- "Brand" select options: not specified. Default plan: derive distinct brands from the seeded items (server-fetched, passed as a prop into the client form), sorted alphabetically. If recruiters need a brand not in the list, that's a follow-up. Confirm at start.
- Form stack: shadcn `Form` is the react-hook-form + zod pattern. Install those packages alongside the shadcn primitives.
- Loading skeleton: server components don't have a "loading" state per se — implement via a `<Suspense fallback={<InventorySkeleton />}>` wrapper around the data-fetched section. Skeleton can be a small set of placeholder cards in the same grid layout.
- "Add Device" submit only `console.log`s for this phase. No Server Action, no toast, no DB write. The schema/CRUD wiring will live in Phase 2 alongside actual rent/return.
- Per-card admin actions are decorative — render the icon buttons (Pencil, Trash2, Wrench) but with no `onClick`. Use shadcn `Tooltip` only if it's already installed (it is — used by sidebar).
- The sidebar already has the `/admin` link in `AppSidebar`'s `NAV_ITEMS`, so navigation Just Works once the route exists.
- Out of scope: actual edit/delete/repair-toggle handlers, brand filter dropdown, status filter dropdown, AI semantic search, user management (Phase 2), schema changes, server actions for items.

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
- 2026-04-28 — My Rentals UI + Route Restructure: introduced `(app)` route group so the sidebar layout covers multiple pages; renamed the hardware list route from `/dashboard` to `/hardware` and updated the sidebar logo link accordingly; added `/my-rentals` async server component (force-dynamic) backed by `src/lib/db/rentals.ts` `getMyRentals(email)` which filters items by `assignedTo + IN_USE` and orders by `returnDate`; added `src/lib/auth.ts` `getCurrentUserEmail()` returning `j.doe@booksy.com` as a placeholder until NextAuth lands; copied the dashboard `ItemCard` into `src/components/my-rentals/item-card.tsx` with a Return button (always shown) plus an optional `due` prop rendering a Clock + formatted deadline; built `MyRentalsList` with the same grid/list view-mode toggle as `HardwareList` (no search/sort) and a basic empty state.
- 2026-04-28 — Prod DB Seed + README: installed `dotenv-cli`; added `db:migrate:deploy:prod`, `db:seed:prod`, `db:test:prod` npm scripts that pipe `.env.production` through dotenv-cli so the prod target is always explicit; applied the existing migration and ran the existing seed against the prod Neon branch (3 users, 11 items, 5 rental history entries — verified via `db:test:prod`); replaced the create-next-app default README with a project README led by a Demo Accounts table (admin/j.doe/a.smith with seeded passwords), followed by quick-start, scripts reference, tech stack, and TODO sections for the fuller README content (status, trade-offs, AI dev log, screenshots).
