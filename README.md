# Hardware Hub

AI-native internal tool for managing, renting, and maintaining company hardware. Built for the Booksy Early Careers recruitment assignment.

**Live demo:** https://hardware-hub-azure.vercel.app/login

The fastest review path is the live demo with the seeded accounts below — zero local setup. Run locally only if you want to poke at the code.

---

# Quick Start

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Required env vars (see [`.env.example`](.env.example)):

```env
DATABASE_URL=         # Postgres connection string (Neon free tier works)
AUTH_SECRET=          # generate with: openssl rand -base64 32
AUTH_URL=             # http://localhost:3000 for local dev
OPENAI_API_KEY=       # optional — AI search falls back gracefully when missing
```

Working credentials for the evaluation period are provided in the submission email so reviewers can run locally without provisioning their own Neon / OpenAI accounts.

---

# Demo Accounts

| Role  | Email              | Password |
| ----- | ------------------ | -------- |
| Admin | admin@booksy.com   | admin123 |
| User  | j.doe@booksy.com   | user123  |
| User  | a.smith@booksy.com | user123  |

---

# Features

**Inventory & Rentals**

- Hardware catalog with grid + list views, search, sorting, status + category filters
- Rent / return workflow with confirmation modals (7 / 14 / 30-day presets)
- Optimistic UI with server-revalidation as source of truth
- Due-soon / overdue indicators with animated state on rental cards
- Item categories (Laptop / Phone / Tablet / Mouse / Keyboard / Other) with per-category Lucide icons on every card

**Admin**

- Full device CRUD with race-safe IN_USE guards (transactional `updateMany` filters)
- Repair toggle
- User CRUD: create / edit (name + role) / delete with `SELF_DELETE` / `LAST_ADMIN` / `ACTIVE_RENTALS` guards
- Three-layer RBAC: edge proxy + page-level `requireAdmin()` + DAL re-checks

**Auth & UX**

- Auth.js v5 credentials provider with edge-safe split config
- bcrypt-hashed passwords (12 rounds), JWT sessions
- Shared `PasswordInput` component with Eye / EyeOff visibility toggle on every password field
- Confirm-password validation in the Create User dialog via Zod `.refine()`

**AI**

- Semantic search via OpenAI `gpt-5-nano` — JSON mode, server-validated id list (model can't invent ids), PII-stripped prompt, graceful fallback when API is unavailable

---

# Implementation Status & Trade-offs

## ✅ Fully Implemented

- Auth + RBAC (Auth.js v5 credentials, JWT, edge-safe admin gating)
- Inventory CRUD with race-safe transactional guards
- Rental engine with confirmation modals, Sonner toasts, optimistic UI
- Admin user CRUD with three guards on delete
- Item categories + unified inventory toolbar (search · status · category · sort · view)
- Password UX (visibility toggle + confirm-password validation)
- AI semantic search with id validation and graceful API fallback
- Three Playwright e2e specs (auth, rental, admin user creation) hitting seeded Neon
- Seed data normalization — all 7 intentional data-quality issues cleaned in the migration
- Industrial dark UI (JetBrains Mono headings, cyan brand accent, view toggles)

## ⚡ Shortcuts & Hacks

**JWT instead of database sessions** — keeps the proxy edge-fast and avoids hitting Postgres on every request. Future: DB sessions + a `sessionVersion` column for instant revocation.

**`Item.assignedTo` references `User.email`** — the schema was drafted before auth landed. Email is unique so the FK is sound, but it's why I had to add the `ACTIVE_RENTALS` guard on user delete. Future: refactor to `userId`.

**Playwright e2e instead of Vitest** — the brief asks for "3 critical tests"; e2e covers the full stack with higher confidence than mocked unit tests for an MVP. Future: Vitest for fast DAL coverage of guard logic.

## ⚠️ Partial / Missing

- Vitest unit tests for DAL guard ordering (queued — see roadmap)
- Password reset flow (admins re-create users to "reset")
- AI features beyond search — Smart Assistant and Inventory Auditor (per brief's three options) were de-scoped to keep semantic search polished

## 🔮 24h Roadmap

1. Wire Vitest + write DAL unit tests for the rental state machine, `deleteUser` guard ordering, and `aiSearchItemIds` validation
2. Inventory Auditor as a second AI feature — flag contradictory status/notes pairs, missing brands, suspicious dates (a natural fit for the seeded data-quality issues)
3. CI pipeline running build + Playwright on every push to main

---

# AI Development Log

## Tooling

- **Claude Code (Sonnet / Opus)** — primary implementation driver, used with custom slash commands and skills (see [AI Workflow](#ai-workflow))
- **Cursor** — selectively for tight inline-completion loops
- **v0 by Vercel** — used early for design prototyping only; no v0 code was copied into this repo. Prototype: https://v0-hardware-hub-prototype.vercel.app/dashboard. Email: admin@booksy.com. Password: admin123
- **MCP servers** — Context7 (live docs), Neon (DB inspection), Playwright (browser automation)

## Data Strategy

The recruitment seed contains seven intentional data-quality issues. AI helped audit each one before writing the migration:

| Issue                        | ID  | Resolution                               |
| ---------------------------- | --- | ---------------------------------------- |
| Duplicate ID                 | 4   | Reassigned the Lenovo laptop to `item_8` |
| Contradictory status + notes | 5   | `Available` → `REPAIR`                   |
| Future purchase date         | 6   | Normalized to current date placeholder   |
| Brand typo                   | 9   | `"Appel"` → `"Apple"`                    |
| Non-standard date format     | 9   | `"22-05-2023"` → ISO `2023-05-22`        |
| Missing brand / null date    | 10  | Brand `"Unknown"`, status → `AVAILABLE`  |
| History note with damage     | 11  | `Available` → `REPAIR`                   |

Each fix is documented in `prisma/seed.ts`; the original messy data is recoverable from `src/lib/mock-data.ts` and the recruitment PDF. I also seeded `j.doe@booksy.com` and `a.smith@booksy.com` so existing `RentalHistory` foreign keys resolve.

The natural follow-up is the Inventory Auditor AI feature, which would ingest the unnormalized dataset and have the model itself flag exactly these issue categories — turning the data-quality story into a live demo.

## Prompt Trail

Rather than capturing raw chat logs, the AI collaboration trail is structured into three stable artifacts:

1. **`context/features/`** — every feature scoped as a markdown spec _before_ implementation. The spec is the prompt.
2. **`context/current-feature.md`** — chronological history of every shipped phase with file paths, tradeoffs, and known caveats. Functions as a running ADR.
3. **`.claude/skills/feature/`** — custom Claude Code skill that codifies the `load → start → review → test → complete` loop.

Git history mirrors this: each feature is a small, focused commit mapping to one spec, with a `chore: reset current-feature.md` commit closing the phase.

## The "Correction"

During Auth Phase 3, I asked Claude to add an admin-route gate. The first implementation read `auth?.user?.role !== "ADMIN"` inside the proxy's `authorized` callback. It compiled, the build passed, and locally I was already an ADMIN, so the redirect worked from my session.

Switching to a USER login surfaced the bug: every authed user was being bounced from `/admin`, even admins after their JWT refreshed. The cause: the `jwt` and `session` callbacks copying `role` onto the token were in `src/auth.ts`, not the edge-safe `src/auth.config.ts`. The proxy reads the edge-safe config (it can't import the Prisma adapter), so the edge-side `auth` call saw a token where `role` was `undefined` — and `undefined !== "ADMIN"` is always true.

The fix moved the callbacks to `src/auth.config.ts` so both the full Node runtime and the edge proxy see the same enriched session. I also added `requireSession()` / `requireAdmin()` helpers and called `requireAdmin()` directly in `/admin/page.tsx` for defense-in-depth.

The lesson: **AI can't smell architectural splits like edge-safe vs full-runtime config until they bite at runtime.** Catching it required testing both roles end-to-end in a browser, not just reading the diff.

---

# AI Workflow

Custom Claude skills in `.claude/skills/feature/` drive the lifecycle:

```text
/feature load     → load a spec + project context
/feature start    → branch + implement against the spec
/feature test     → manual / TDD validation
/feature review   → refinement pass before commit
/feature complete → commit, merge, reset working file, append to history
```

<img width="2421" height="3748" alt="AI Workflow" src="https://github.com/user-attachments/assets/a40c34e3-f5ef-4972-b650-8b7e5007f546" />

Three MCP servers participated:

- **Context7** — live docs for Next.js 16, Auth.js v5, Prisma 7, Tailwind v4, shadcn (training cutoffs lie about new APIs)
- **Neon** — direct DB inspection during seed verification and rental-flow debugging
- **Playwright** — browser automation for smoke-testing UI flows after changes

Each plugs a hole the model can't fill from its own context: current truth on libraries, ground truth on the database, ground truth on the rendered UI.

---

# Tech Stack

**Frontend** — Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict), Tailwind CSS v4 (CSS-first config), shadcn/ui, Lucide, Sonner, React Hook Form + Zod

**Backend** — Prisma 7, Neon serverless Postgres, Auth.js v5 (Credentials, JWT), bcryptjs (12 rounds), Server Actions

**AI** — OpenAI SDK + `gpt-5-nano`

**Tooling** — ESLint v9, Playwright (Chromium, serial workers for DB tests), `dotenv-cli`

---

# Useful Scripts

| Script                           | Description                          |
| -------------------------------- | ------------------------------------ |
| `npm run dev`                    | Start dev server (Turbopack)         |
| `npm run build`                  | Production build                     |
| `npm run lint`                   | Run ESLint                           |
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
2. **`rental.spec.ts`** — pick first AVAILABLE card → confirm rent → toast + Rent button gone → find item on `/my-rentals` → confirm return → card gone.
3. **`admin-user.spec.ts`** — admin opens Create User → fills unique-suffixed email → submits → toast + new user in list → logs out → logs in as new user → lands on `/hardware`.

Run with `npm run test:e2e`. Tests run serially (`workers: 1`) because they touch the seeded Neon dev DB.

---

# Reviewer Guide

For deeper architectural context, start with:

```text
context/project-overview.md   — product spec
context/current-feature.md    — chronological implementation history (ADR)
context/features/             — per-phase feature specs (the prompts)
.claude/skills/feature/       — custom workflow commands
```
