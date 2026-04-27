# Current Feature: Dashboard UI Phase 2

Phase 2 of 3 for the dashboard UI layout — flesh out the sidebar with branding, navigation, user avatar area, collapsible behaviour on desktop, and drawer behaviour on mobile.

## Status

In Progress

## Goals

- Make the sidebar collapsible (desktop)
- Render three nav links in the sidebar: Hardware List, My Rentals, Admin Panel
- Add a user avatar area pinned to the bottom of the sidebar
- Add the "Hardware Hub" name + logo icon at the top of the sidebar
- On mobile (always — i.e. not just collapsed), the sidebar must be a drawer

## Notes

- Phase 2 of 3 — keep scope to the sidebar shell. No real auth, routing targets can be the eventual route paths from project-overview (`/hardware`, `/my-rentals`, `/admin`) even though those pages don't exist yet.
- Visual reference: `@context/screenshots/dashboard-ui-main.png`.
- Mock data lives at `@src/lib/mock-data.ts` — import it directly for any user info needed (e.g. avatar area). No DB yet.
- Lucide icons for nav items per `@context/project-overview.md` icon mappings (Monitor / Package / Shield).
- Phase 1 reference: `@context/features/dashboard-phase-1-spec.md` (already merged — current sidebar is just an `h2` placeholder).
- Tailwind v4 — theme config in `src/app/globals.css` via `@theme`. Do NOT create `tailwind.config.{ts,js}`.
- Consider `npx shadcn@latest add sidebar sheet avatar` for the collapsible/drawer/avatar primitives — phase 1 only installed `button`.

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-04-27 — Initial setup of Next.js 16 (App Router) with React 19, TypeScript, Tailwind CSS v4, ESLint v9 (flat config), and Vitest test scripts scaffolded.
- 2026-04-27 — Dashboard UI Phase 1: initialized shadcn/ui (components.json, theme tokens in globals.css, lib/utils, button primitive), defaulted the app to dark mode, and added the `/dashboard` route with sidebar + main layout placeholders.
