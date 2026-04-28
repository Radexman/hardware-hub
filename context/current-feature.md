# Current Feature: Prod DB Seed + README Credentials Section

Wire up a clean way to target the production Neon branch from the CLI, run the existing seed against it, and start the project README with a section that documents the demo login credentials for the Booksy recruiters.

## Status

In Progress

## Goals

- Add `dotenv-cli` so prisma CLI commands can be run against `.env.production` without renaming files or fiddling with the shell
- Add npm scripts that make the prod target explicit (one each for migrate-deploy and seed against `.env.production`); keep the dev flow working as-is
- Apply the existing init migration to the prod Neon branch
- Run the existing `prisma/seed.ts` against the prod branch so it has the same 3 users + 11 items + 5 rental history rows the dev branch has
- Verify the prod branch contents (e.g. via the existing `scripts/test-db.ts`, pointed at prod via dotenv-cli)
- Create an initial `README.md` containing: project name + one-paragraph intro, a quick-start section, and a clearly-headed "Demo accounts" / "Login credentials" section listing admin + both regular users with their seeded passwords

## Notes

- This is a Booksy recruitment-task deliverable, not a real production system. Hardcoded plaintext fixture passwords (`admin123`, `user123`) are intentional — recruiters need them to log in. Document them prominently in the README so that's the first place reviewers find them.
- `.env.production` already exists locally with the prod connection string. `.env*` is gitignored, so neither `.env` nor `.env.production` get committed. The README will list the credentials in plaintext because that's the expected reviewer experience here.
- The seed is idempotent (upserts on stable keys), so re-running against prod is safe.
- Order of ops on first prod deploy: `prisma migrate deploy` first (so tables exist), then `prisma db seed`.
- Suggested npm scripts (final names TBD at start):
    - `db:migrate:deploy:prod` → `dotenv -e .env.production -- prisma migrate deploy`
    - `db:seed:prod` → `dotenv -e .env.production -- prisma db seed`
    - Optional: a `db:test:prod` that runs `scripts/test-db.ts` against prod, mirroring dev usage
- Keep the dev path identical to today: `npx prisma migrate dev`, `npx prisma db seed`, `npx tsx scripts/test-db.ts` — no behavior change there.
- README scope for this pass: starter scaffold + credentials section. The full README per `project-overview.md` (implementation status, trade-offs, AI dev log, screenshots, etc.) will land in a later phase — call it out as TODO sections so the structure is in place.
- Don't accidentally commit `.env.production` itself; only the npm scripts that consume it.

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
