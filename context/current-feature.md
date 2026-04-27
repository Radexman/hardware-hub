# Current Feature: Dashboard UI Phase 1

Phase 1 of 3 for the dashboard UI layout — initial scaffold with ShadCN, the `/dashboard` route, and placeholder sidebar/main regions.

## Status

In Progress

## Goals

- Initialize ShadCN UI in the project and install the components needed for the dashboard scaffold
- Create the `/dashboard` route (App Router page)
- Build the main dashboard layout (sidebar + main content split) and wire any global styles required for it
- Default the app to dark mode
- Render placeholders only for now: an `h2` reading "Sidebar" in the sidebar region and an `h2` reading "Main" in the main content region

## Notes

- This is phase 1 of 3 — keep scope tight to layout + placeholders. No real content, data wiring, or interactions yet.
- Visual reference: `@context/screenshots/user-hardware-list.png` (target look — does not need to be exact).
- Design direction, color tokens, typography, and layout structure are defined in `@context/project-overview.md` (industrial-utilitarian, dark mode by default, JetBrains Mono + Geist Sans, sidebar-left / main-right).
- Mock data lives at `@src/lib/mock-data.ts` for later phases.
- Tailwind CSS v4 — theme config goes in `src/app/globals.css` via `@theme`. Do NOT create `tailwind.config.{ts,js}`.

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-04-27 — Initial setup of Next.js 16 (App Router) with React 19, TypeScript, Tailwind CSS v4, ESLint v9 (flat config), and Vitest test scripts scaffolded.
