# Current Feature: Prisma + Neon Postgres Setup

Set up Prisma ORM against a serverless Neon Postgres database with the initial schema and a clean migration workflow.

## Status

In Progress

## Goals

- Wire up Neon Postgres (serverless) as the database, with `DATABASE_URL` pointing at the development branch
- Install and configure Prisma 7 (account for breaking changes vs. older versions)
- Create the initial schema from the data models in `@context/project-overview.md` (User, Item, RentalHistory + enums Role, ItemStatus, RentalAction)
- Add NextAuth v5 models alongside the app schema (Account, Session, VerificationToken)
- Add the indexes and cascade deletes called for in the draft schema and standards
- Generate the initial migration via `prisma migrate dev` (do not use `prisma db push`)
- Wire a Prisma client singleton suitable for Next.js (avoid hot-reload connection storms)

## Notes

- The schema in `@context/project-overview.md` is a rough draft and will evolve — favor the structure there but don't over-fit; expect iteration in later phases (auth, rentals, admin).
- Two database branches: the dev branch is what `DATABASE_URL` resolves to during development; production is a separate branch. **Always** create migrations and never push directly unless explicitly told.
- Coding standards reminder (`@context/coding-standards.md`): use `prisma migrate dev` for schema changes, `prisma migrate status` before committing, `prisma migrate deploy` in production.
- Prisma 7 has breaking changes — review the upgrade guide before installing/configuring: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
- Quickstart reference: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres
- Seed data and the data-quality fixes documented in `project-overview.md` (duplicate ID, future dates, brand typos, etc.) are out of scope here unless explicitly requested — this phase is schema + connection only.
- Secrets (Neon connection string) belong in `.env`/`.env.local`, never committed.

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-04-27 — Initial setup of Next.js 16 (App Router) with React 19, TypeScript, Tailwind CSS v4, ESLint v9 (flat config), and Vitest test scripts scaffolded.
- 2026-04-27 — Dashboard UI Phase 1: initialized shadcn/ui (components.json, theme tokens in globals.css, lib/utils, button primitive), defaulted the app to dark mode, and added the `/dashboard` route with sidebar + main layout placeholders.
- 2026-04-27 — Dashboard UI Phase 2: added shadcn sidebar/sheet/avatar/tooltip primitives, built `AppSidebar` (Hardware Hub header logo, three nav links with collapsed-icon tooltips, user footer from mock-data + logout placeholder), wired `SidebarProvider`/`TooltipProvider` into the dashboard layout with a mobile-only `SidebarTrigger` (drawer below 768px), and refactored `useIsMobile` to `useSyncExternalStore`.
- 2026-04-27 — Dashboard UI Phase 3: populated `/dashboard` with the hardware list view — `ItemCard` (name + color-coded status badge, brand, formatted purchase date, optional assignee + notes) and `HardwareList` client component owning case-insensitive substring search across name/brand/notes plus Name/Brand/Date/Status sort buttons, rendered in a responsive 1/2/3-col grid from mock items.
- 2026-04-27 — Refined UI: swapped Geist Mono → JetBrains Mono and renamed font CSS variables to `--font-sans`/`--font-mono` (headings now mono); added a `--brand` cyan-400 token and applied `text-brand`/`bg-brand` to the logo, search icon, avatar fallback, active sort button, assigned-to email, and Rent button; replaced `SidebarRail` with an explicit `SidebarTrigger` in the sidebar header; ItemCard gained a per-status right-edge stripe (`border-r-4`), subtle hover lift + shadow, and a decorative Rent button on AVAILABLE items only.
- 2026-04-27 — Item Cards: added shadcn `button-group` primitive; flipped the per-status card stripe from the right edge to the left edge; regrouped grid-card content into header / meta / body / action sections with `mt-auto` Rent for cross-card alignment; introduced a `view` prop on `ItemCard` plus a list-row layout (inline name · brand · date · assigned with truncated notes underneath); converted the sort controls into a segmented `ButtonGroup` and added a `LayoutGrid` / `List` view-mode toggle on the right of the toolbar with active state in the cyan brand color.
