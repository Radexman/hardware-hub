# Current Feature: Database Seed Script

Create a Prisma seed script (`prisma/seed.ts`) that populates the dev database with the admin/regular user accounts and the mock items + rental history used by the dashboard today.

## Status

In Progress

## Goals

- Add a `prisma/seed.ts` script wired into Prisma 7's seed configuration so it can be run via `prisma db seed`
- Hash passwords with `bcryptjs` (12 rounds) — install the dependency
- Seed an **admin** user: `admin@booksy.com` / "Alex Admin" / password `admin123` / role `ADMIN` / `emailVerified` = now
- Seed a **regular** user: `j.doe@booksy.com` / "John Doe" / password `user123` / role `USER` / `emailVerified` = now
- Seed all items from `@src/lib/mock-data.ts` into the `Item` table
- Seed the rental history entries from `@src/lib/mock-data.ts` into the `RentalHistory` table, remapping the mock userIds to the real created user IDs
- Make the script idempotent (use upserts on stable keys like email) so re-running doesn't duplicate rows

## Notes

- Prisma 7 changed seeding: it no longer runs automatically with `migrate`. The seed entry point must be declared in `prisma.config.ts` (or `package.json`'s `prisma.seed`) and invoked via `npx prisma db seed`.
- `mock-data.ts` references a third user `a.smith@booksy.com` on item 10 + rental history (`user_asmith`). The spec only defines two users (admin + j.doe). Decision needed at `start` time: (a) add Alice Smith as a third seed user, (b) reassign item 10 / Alice's history to j.doe, or (c) drop those entries. **Default plan: add Alice Smith** so the existing dashboard data renders unchanged — confirm at start.
- Mock `rentalHistory` uses string userIds (`user_jdoe`, `user_asmith`) that don't match Prisma `cuid()` IDs. Map them to real user IDs after the user upserts.
- Item 10's `assignedTo` is `a.smith@booksy.com`, requiring that user to exist before the item insert — order matters: users → items → rental history.
- Plain-text passwords (`admin123`, `user123`) are dev-only fixture credentials. Do not document them in committed README until later phases consciously do so.
- Run order: ensure migrations are applied (`prisma migrate dev` or `deploy`) before seeding so the tables exist.
- Out of scope here: the data-quality fixes mentioned in `project-overview.md` (duplicate IDs, future dates, brand typos) — those came from a different draft list and are not in `mock-data.ts`.

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-04-27 — Initial setup of Next.js 16 (App Router) with React 19, TypeScript, Tailwind CSS v4, ESLint v9 (flat config), and Vitest test scripts scaffolded.
- 2026-04-27 — Dashboard UI Phase 1: initialized shadcn/ui (components.json, theme tokens in globals.css, lib/utils, button primitive), defaulted the app to dark mode, and added the `/dashboard` route with sidebar + main layout placeholders.
- 2026-04-27 — Dashboard UI Phase 2: added shadcn sidebar/sheet/avatar/tooltip primitives, built `AppSidebar` (Hardware Hub header logo, three nav links with collapsed-icon tooltips, user footer from mock-data + logout placeholder), wired `SidebarProvider`/`TooltipProvider` into the dashboard layout with a mobile-only `SidebarTrigger` (drawer below 768px), and refactored `useIsMobile` to `useSyncExternalStore`.
- 2026-04-27 — Dashboard UI Phase 3: populated `/dashboard` with the hardware list view — `ItemCard` (name + color-coded status badge, brand, formatted purchase date, optional assignee + notes) and `HardwareList` client component owning case-insensitive substring search across name/brand/notes plus Name/Brand/Date/Status sort buttons, rendered in a responsive 1/2/3-col grid from mock items.
- 2026-04-27 — Refined UI: swapped Geist Mono → JetBrains Mono and renamed font CSS variables to `--font-sans`/`--font-mono` (headings now mono); added a `--brand` cyan-400 token and applied `text-brand`/`bg-brand` to the logo, search icon, avatar fallback, active sort button, assigned-to email, and Rent button; replaced `SidebarRail` with an explicit `SidebarTrigger` in the sidebar header; ItemCard gained a per-status right-edge stripe (`border-r-4`), subtle hover lift + shadow, and a decorative Rent button on AVAILABLE items only.
- 2026-04-27 — Item Cards: added shadcn `button-group` primitive; flipped the per-status card stripe from the right edge to the left edge; regrouped grid-card content into header / meta / body / action sections with `mt-auto` Rent for cross-card alignment; introduced a `view` prop on `ItemCard` plus a list-row layout (inline name · brand · date · assigned with truncated notes underneath); converted the sort controls into a segmented `ButtonGroup` and added a `LayoutGrid` / `List` view-mode toggle on the right of the toolbar with active state in the cyan brand color.
- 2026-04-28 — Prisma + Neon Postgres: installed Prisma 7 with the new `prisma-client` generator (output to `src/generated/prisma`, gitignored) + `@prisma/adapter-neon` over `@neondatabase/serverless`; added `prisma.config.ts` reading `DATABASE_URL` from `.env`; authored the initial schema (User, Item, RentalHistory + Role/ItemStatus/RentalAction enums, NextAuth Account/Session/VerificationToken, indexes, cascade deletes); created `src/lib/prisma.ts` with a globalThis singleton; bumped `tsconfig` `target` to ES2023; generated and applied the `init` migration to the Neon dev branch.
