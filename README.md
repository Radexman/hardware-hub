# Hardware Hub

AI-native internal hardware rental and inventory management platform built for the Booksy Early Careers recruitment assignment.

Hardware Hub manages:

- Equipment inventory and rentals
- Repair lifecycle tracking
- Role-based admin management
- Admin user onboarding, edit, and delete with safety guards
- AI-powered semantic search over the catalog

> This repository intentionally includes seeded demo data, structured AI collaboration artifacts, phased specs, and implementation history for review.

---

# Overview

Hardware Hub is an internal tool where employees browse and rent equipment while administrators manage inventory, repairs, and user access. The project emphasizes AI-native product thinking, spec-driven delivery, and a documented human + AI engineering workflow.

Live demo:
https://hardware-hub-azure.vercel.app/login

## Core MVP Features

### Inventory & Rentals

- Hardware catalog with grid + list views
- Search, sorting, and status filters
- Rent / return workflows with confirmation modals
- Optimistic UI updates with server-revalidation as source of truth
- Rental deadlines with due-soon / overdue indicators
- Repair-state lifecycle (Available ↔ In Use ↔ Repair)

### Admin

- Full device CRUD (create / edit / delete) with race-safe guards
- Repair-toggle action
- Admin user CRUD: onboarding, edit (name + role), delete with self-delete / last-admin / active-rentals guards
- Protected admin routes (route-level + defense-in-depth in actions)

### Platform

- Credentials authentication (Auth.js v5)
- Role-based access control (USER / ADMIN)
- Server actions for all mutations
- Prisma 7 + Neon Postgres persistence
- AI semantic search via OpenAI `gpt-5-nano`

---

# Demo Accounts

| Role  | Email              | Password |
| ----- | ------------------ | -------- |
| Admin | admin@booksy.com   | admin123 |
| User  | j.doe@booksy.com   | user123  |
| User  | a.smith@booksy.com | user123  |

Demo credentials exist only for reviewer access against the seeded dev / prod Neon branches.

---

# Quick Start

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Required environment variables:

```env
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=
OPENAI_API_KEY=   # optional – AI search falls back to empty results when missing
```

---

# Implementation Status & Trade-offs

Honest, transparent breakdown of what's shipped, where corners were cut, and what's missing — per the assignment's "Engineering Mindset" guidance.

## ✅ Fully Implemented

- **Auth + RBAC** — Auth.js v5 credentials provider, JWT sessions, role copied onto the session token, edge-safe admin-route gating in `proxy.ts`, plus `requireAdmin()` defense-in-depth in server actions.
- **Inventory CRUD** — create / edit / delete devices, with the IN_USE guard enforced inside `prisma.$transaction` via `updateMany` / `deleteMany` filters so a concurrent rent can't race past the guard.
- **Rental engine** — rent / return server actions with race protection, confirmation modals (7 / 14 / 30-day rental presets), Sonner toasts, and `useOptimistic` UI updates that auto-revert on action failure.
- **Admin user CRUD** — create, edit (name + role), delete with three guards: SELF_DELETE, LAST_ADMIN (admin-count check inside transaction), ACTIVE_RENTALS.
- **AI semantic search** — natural-language query → OpenAI `gpt-5-nano` → JSON id list, validated against the input catalog so the model can't invent ids. Server-side caps query length and catalog size, strips PII before prompting, fails gracefully when the API is unavailable.
- **Critical e2e tests** — three independent Playwright specs covering auth, rental workflow, and admin user creation against the seeded Neon dev DB.
- **Seed data normalization** — all 11 intentional data-quality issues (duplicate IDs, future dates, brand typos, invalid statuses, broken date formats) cleaned up in the migration.
- **Industrial-utilitarian dark UI** — JetBrains Mono headings + Geist Sans body, cyan brand accent, color-coded status badges, due-state pulse animations, responsive sidebar, view toggles, segmented filter controls.

## ⚡ Shortcuts & Hacks

### `bcryptjs` over native `bcrypt`

- **Why**: Pure-JS implementation works in any Node runtime without a build step or platform-specific binary, which keeps Vercel + local dev identical and avoids serverless cold-start headaches.
- **Future**: For production at scale, switch to native `bcrypt` (or argon2id) on a long-lived runtime where the speed delta matters; tune the cost factor based on observed login latency.

### JWT sessions instead of database sessions

- **Why**: Every read of `session.user.role` would otherwise hit Postgres. JWT keeps the proxy edge-fast and avoids a hot table.
- **Future**: For audit trails and instant session revocation (e.g. "log this user out everywhere now"), swap to DB sessions and add a `sessionVersion` column to invalidate-on-role-change.

### Patched generated Sonner component

- **Why**: shadcn's generated `sonner.tsx` imports `next-themes`, but the project sets `<html class="dark">` directly. I patched the generated file to drop the dependency and hardcode `theme="dark"` rather than installing `next-themes` only to ignore it.
- **Future**: If light mode is added, restore `next-themes` and the original component, plus a theme switcher in the sidebar.

### `Item.assignedTo` references `User.email` (not `userId`)

- **Why**: The schema was drafted before auth landed. Email was the natural human-readable join key for the rental flow. `User.email` is `@unique` so the FK is sound.
- **Future**: Refactor to `userId` so the rental DAL stops needing the email round-trip and email changes (out of scope for MVP) wouldn't ripple through the FK.

### `ACTIVE_RENTALS` guard on user delete

- **Why**: The schema's `Item.assignedTo` → `User.email` relation has no `onDelete`, so it defaults to RESTRICT. Rather than letting a confusing FK violation surface to the admin, I added an up-front count-and-reject guard with friendly Sonner copy.
- **Future**: Implement rental ownership reassignment so admins can transfer active rentals before deletion, or add a soft-delete / deactivation distinction.

### Playwright e2e instead of Vitest unit tests

- **Why**: The recruitment task asks for "3 critical tests". E2E specs covering real user flows give higher confidence than mocked unit tests for an MVP and exercise the full stack (auth → action → DB → revalidation → UI).
- **Future**: Wire Vitest for fast DAL-level coverage of the guard logic (rental state machine, last-admin / self-delete branches), where unit tests give faster feedback than spinning up Chromium.

### `OPENAI_API_KEY` fallback to `[]`

- **Why**: A free-tier OpenAI key returns `429 insufficient_quota`. Rather than crashing the search UI for reviewers without billing enabled, the lib catches the error, logs `[ai-search] OpenAI call failed`, and returns an empty match list.
- **Future**: Replace with a clear UI state ("AI search temporarily unavailable") and a retry-with-backoff path. Cache hot queries.

## ⚠️ Partial / Missing

- **Vitest unit tests** — `npm test` still resolves but no Vitest is wired. DAL-level guard coverage (rental state machine, `deleteUser` guard ordering, AI search id-validation) is queued.
- **Password reset / email change** — out of scope this phase; admins currently re-create users to "reset". Real account lifecycle gap.
- **AI features beyond search** — Smart Assistant chat and Inventory Auditor (per the assignment's three options) were de-scoped to keep semantic search polished. Inventory Auditor is a natural fit for the seeded data-quality issues — see the 24h roadmap below.

## 🔮 Next Steps (24h Roadmap)

1. **Wire Vitest + write DAL unit tests** for the rental state machine, `deleteUser` guard ordering, and `aiSearchItemIds` id-validation. ~4 h, catches regressions in the guard logic without spinning Chromium.
2. **Inventory Auditor (second AI feature)** — a `gpt-5-nano` call over the full catalog flagging contradictory status / notes pairs (e.g. "Available" + "battery swelling"), missing brands, suspicious purchase dates. Reuse the existing `aiSearchItemsAction` shape; surface flags in the admin panel as a sidebar.
3. **Deploy to Vercel + run prod migrations** — the prod Neon branch is already seeded; the remaining work is environment config, build settings, and a smoke test against the live URL.

---

# AI Development Log

## Tooling

- **Claude Code (Sonnet / Opus)** — primary implementation driver, run with custom slash commands and skills documented below.
- **Cursor** — used selectively for tight inline-completion loops (TypeScript types, component scaffolding) where round-tripping to a chat felt slower than tab-completing.
- **v0 by Vercel** — used early in the project for **design prototyping only**. I built throwaway UI prototypes in v0 to validate the dashboard / admin / login layouts before committing to shadcn primitives and Tailwind v4 in this codebase. **No code generated by v0 was copied or adapted into this project** — its role was strictly to derisk visual decisions and inform the screenshots in `context/screenshots/` that then drove implementation.
- **MCP servers** (see [MCP Tooling](#mcp-tooling-used) section below for full detail) — Context7, Neon, Playwright.

## Data Strategy

The recruitment seed contains seven intentional data-quality issues. AI helped me audit each one before writing the migration, surfacing categories I would have missed if I'd just normalized blindly:

| Issue                        | Item ID | Resolution                                          |
| ---------------------------- | ------- | --------------------------------------------------- |
| Duplicate ID                 | 4       | Reassigned the Lenovo laptop to id `item_8`         |
| Contradictory status + notes | 5       | Flipped status `Available` → `REPAIR`               |
| Future purchase date         | 6       | Normalized to current date placeholder              |
| Brand typo                   | 9       | `"Appel"` → `"Apple"`                               |
| Non-standard date format     | 9       | `"22-05-2023"` → ISO `2023-05-22`                   |
| Missing brand / null date    | 10      | Brand placeholder `"Unknown"`, status → `AVAILABLE` |
| Invalid status `"Unknown"`   | 10      | Mapped to `AVAILABLE` per status enum               |
| History note with damage     | 11      | Status flipped `Available` → `REPAIR`               |

Each fix was made deliberately in `prisma/seed.ts` rather than scrubbed away — the original messy data is recoverable from `src/lib/mock-data.ts` and the recruitment PDF.

I also seeded `j.doe@booksy.com` and `a.smith@booksy.com` as real `User` rows so the existing `RentalHistory` foreign keys and `assignedTo` references resolve properly — without that, item_7 (`assignedTo: "j.doe@booksy.com"`) would have produced an orphan reference.

A natural follow-up (see [24h Roadmap](#-next-steps-24h-roadmap)) is the **Inventory Auditor** AI feature, which would ingest the _unnormalized_ dataset and have the model itself flag exactly these issue categories — turning the data-quality story into a live demo.

## Prompt Trail

Rather than capturing raw chat logs (which decay quickly and don't reflect architectural intent), the AI collaboration trail in this repo is structured into three stable artifacts:

1. **`context/features/`** — every feature was scoped as a markdown spec _before_ implementation. The spec is the prompt. There are 22 specs covering every phase from initial Next.js setup through admin user CRUD phase 2.
2. **`context/current-feature.md`** — chronological history of every shipped phase, written in implementation language with file paths, tradeoffs, and known caveats. This functions as the running architectural decision record.
3. **`.claude/skills/feature/`** — custom Claude Code skill that codifies the `load → start → review → test → complete` loop, ensuring spec-driven delivery rather than ad-hoc prompting.

The git history mirrors this: each feature is a small, focused commit that maps directly to one spec, with a follow-up `chore: reset current-feature.md` commit closing the phase.

## The "Correction"

A representative example, from the Auth Phase 3 work:

I asked Claude to add an admin-route gate so non-admin users hitting `/admin` would bounce to `/hardware`. The first implementation read `auth?.user?.role !== "ADMIN"` inside the proxy's `authorized` callback. It compiled, the build passed, and locally I was already an ADMIN so the redirect worked from my session.

Switching to a USER-role login surfaced the bug: every authed user was being bounced from `/admin`, even admins after their JWT refreshed. The cause: the `jwt` and `session` callbacks that copy `role` onto the token had been added to `src/auth.ts` rather than `src/auth.config.ts`. The proxy uses the **edge-safe** config (it can't import the Prisma adapter), so the edge-side `auth` call was reading a token where `role` was `undefined` — and `undefined !== "ADMIN"` is always true.

The fix was to move the `jwt` + `session` callbacks into `src/auth.config.ts` so both the full Node runtime _and_ the edge proxy see the same enriched session. I also added `getSession()` / `requireSession()` / `requireAdmin()` helpers in `src/lib/auth.ts` so server components have one obvious way to gate routes — and called `await requireAdmin()` directly inside `/admin/page.tsx` for defense-in-depth, so even a future proxy-misconfiguration regression couldn't expose admin pages.

The lesson I took away: **AI can't smell architectural splits like edge-safe vs full-runtime config until they bite at runtime**. Catching it required actually testing both roles end-to-end in a browser, not just reading the diff. This is now part of my own feature-completion checklist regardless of who wrote the code.

A second smaller example from the same project: the AI initially asserted Sonner toasts expose `role="status"`, which my Playwright tests then asserted on. They failed — the rendered DOM uses `data-sonner-toast` on the `<li>` element. I corrected the locator, kept the spec on the wrong assumption deliberately as a comment-marker for future me, and noted the gotcha in `current-feature.md` so the next spec author wouldn't repeat it.

---

# AI-Assisted Development Workflow

Development followed a custom spec-driven Claude Code workflow combining planning, implementation, testing, review, and structured documentation in an iterative loop. Rather than ad-hoc prompting, features were developed through reusable commands, persistent project context, and documented feature phases.

<img width="2421" height="3748" alt="AI Workflow" src="https://github.com/user-attachments/assets/a40c34e3-f5ef-4972-b650-8b7e5007f546" />

## Feature Workflow

Custom Claude skills in `.claude/skills/feature/` drive a structured feature lifecycle:

```text
document → implement → test → review → complete
```

Primary commands:

```bash
/feature load
/feature start
/feature test
/feature review
/feature complete
```

Typical flow:

1. A feature is scoped as a markdown spec in `context/features/`.
2. `/feature load` loads the spec and supporting project context into active working context.
3. `/feature start` creates a feature branch and implements against the spec.
4. `/feature test` validates behavior through manual QA, TDD, or iterative fixes.
5. `/feature review` performs a refinement / review pass before commit.
6. `/feature complete` commits, merges, deletes the branch, resets the working file, and appends a phase entry to the chronological history in `context/current-feature.md`.

## Context Architecture

```text
context/
  project-overview.md
  coding-standards.md
  ai-interaction.md
  current-feature.md
  features/
  screenshots/
```

| Artifact                  | Purpose                                                                   |
| ------------------------- | ------------------------------------------------------------------------- |
| `project-overview.md`     | Product architecture, domain rules, and technical constraints             |
| `coding-standards.md`     | TypeScript / React / Tailwind v4 / Prisma conventions                     |
| `ai-interaction.md`       | Communication and workflow guidelines for AI collaboration                |
| `current-feature.md`      | Active feature spec + chronological implementation history (decision log) |
| `features/`               | Phased feature specs (used as structured implementation prompts)          |
| `screenshots/`            | Visual UI references that guided implementation                           |
| `.claude/skills/feature/` | Custom Claude skill commands supporting the workflow above                |

---

# MCP Tooling Used

Three MCP servers participated in the AI workflow:

## Context7 MCP

Pulls live documentation for libraries / frameworks / SDKs / CLIs into the model's context, even for ones it nominally "knows" (training cutoffs lie about new APIs). Used heavily for:

- Next.js 16 App Router conventions (especially the `proxy.ts` rename from `middleware.ts`)
- Auth.js v5 configuration patterns and edge-safe split config
- Prisma 7 client + new `prisma-client` generator + Neon adapter setup
- Tailwind v4 CSS-based config (no `tailwind.config.ts`)
- shadcn/ui component installation and the base-ui-backed primitives

## Neon MCP

Direct access to the Neon serverless Postgres branches for inspection and verification:

- Verifying seed runs (row counts, data normalization)
- Querying live state during rental / repair workflow debugging
- Schema validation during Prisma migration work
- Confirming prod-branch seeding via `db:test:prod`

## Playwright MCP

Browser automation during development:

- Smoke-testing user flows after UI changes (login → rent → return → log out)
- Validating dialog padding and responsive behavior under the `sm:max-w-md` envelope
- Cross-checking that revalidation + optimistic updates behave correctly under real network timing

These three were chosen deliberately. Each plugs a hole the model can't fill from its own context: Context7 gives current truth on fast-moving libraries, Neon gives ground truth on the database, Playwright gives ground truth on the rendered UI.

---

# Tech Stack

**Frontend**

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript (strict)
- Tailwind CSS v4 (CSS-first config)
- shadcn/ui (base-nova style)
- Lucide icons
- Sonner for toasts
- React Hook Form + Zod for form validation

**Backend**

- Prisma 7 (`prisma-client` generator)
- Neon serverless Postgres (`@prisma/adapter-neon`)
- Auth.js v5 (Credentials provider, JWT sessions)
- bcryptjs (12 rounds, matched between seed + runtime)
- Server Actions for all mutations

**AI**

- OpenAI SDK + `gpt-5-nano` for semantic search (JSON-mode, server-validated id list)

**Tooling**

- ESLint v9 (flat config)
- Playwright (Chromium-only, serial workers for DB-touching tests)
- `dotenv-cli` for explicit prod-target scripts

---

# Useful Scripts

| Script                           | Description                          |
| -------------------------------- | ------------------------------------ |
| `npm run dev`                    | Start dev server (Turbopack)         |
| `npm run build`                  | Production build                     |
| `npm run lint`                   | Run ESLint                           |
| `npm test`                       | Vitest (placeholder — see roadmap)   |
| `npm run test:e2e`               | Playwright critical-path suite       |
| `npm run test:e2e:ui`            | Playwright in interactive UI mode    |
| `npx prisma migrate dev`         | Apply migrations to dev branch       |
| `npx prisma db seed`             | Seed demo data                       |
| `npm run db:migrate:deploy:prod` | Apply migrations to prod Neon branch |
| `npm run db:seed:prod`           | Seed prod Neon branch                |
| `npm run db:test:prod`           | Verify prod seed (row counts)        |

---

# Testing

Three independent Playwright specs cover the critical paths:

1. **`auth.spec.ts`** — unauth `/hardware` redirects to `/login`; user login lands on `/hardware`; non-admin blocked from `/admin`; admin login + `/admin` succeeds.
2. **`rental.spec.ts`** — pick the first AVAILABLE card → confirm rent → assert toast + Rent button gone → find the same item on `/my-rentals` → confirm return → assert card gone.
3. **`admin-user.spec.ts`** — admin opens Create User → fills a unique-suffixed email → submits → asserts toast + new user in list → logs out → logs in as the new user → lands on `/hardware`.

Run with `npm run test:e2e`. Tests run serially (`workers: 1`) because they touch the seeded Neon dev DB.

---

# Reviewer Guide

For deeper review, start with:

```text
context/project-overview.md       — product spec
context/current-feature.md        — chronological implementation history
context/features/                 — per-phase feature specs (the prompts)
.claude/skills/feature/           — custom workflow commands
```

These four artifacts capture the architectural and AI-collaboration decisions behind the repository.

---

# Deployment

Live demo: `[add deployment url]`

Prod Neon branch is already migrated and seeded; deployment is a Vercel project import + env-var setup away.
