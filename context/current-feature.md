# Current Feature: Dashboard UI Phase 3

Phase 3 of 3 for the dashboard UI layout — populate the main content area on `/dashboard` with the page heading, search bar, sort controls, and the full grid of item cards.

## Status

In Progress

## Goals

- Build out the main area to the right of the sidebar (replacing the current "Main" `h2` placeholder)
- Render a page heading with a short description (e.g. "Hardware List" + "Browse and rent available equipment")
- Add a searchbar that fuzzy-filters the visible cards by typed text (the AI-query layer comes later — for now it's local filtering)
- Add sort controls for "Name", "Brand", "Date", and "Status" (button group, single active sort at a time)
- Render all items from mock-data as cards in a responsive grid

## Notes

- Phase 3 of 3 — closes out the dashboard UI work. After this phase, `/dashboard` should look like the reference screenshot (minus the status/brand filter dropdowns and AI sparkle behaviour, neither of which are in this spec's requirements).
- Visual reference: `@context/screenshots/user-hardware-list.png`.
- Data source: `@src/lib/mock-data.ts` — import `items` directly. (Spec links `mock-data.js` — file is actually `.ts`.)
- Card content per screenshot: name, status badge (color per project-overview status tokens), brand, formatted purchase date with calendar icon, optional `assignedTo`, optional `notes`.
- Search + sort live in the same view and must compose (filter first, then sort).
- Filtering is client-side, so the page (or at least the list region) must be a client component / use a client child.
- Search should be fuzzy / forgiving (case-insensitive substring across name + brand + notes is enough — full Fuse.js is overkill at this stage).
- Sort key is selectable by user; single-direction defaults are fine (Name asc, Brand asc, Date desc, Status asc by enum order).
- Phase 1 + 2 specs in `@context/features/dashboard-phase-1-spec.md` and `@context/features/dashboard-phase-2-spec.md` for prior context.
- Tailwind v4 — theme config in `src/app/globals.css` via `@theme`. Do NOT create `tailwind.config.{ts,js}`.

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-04-27 — Initial setup of Next.js 16 (App Router) with React 19, TypeScript, Tailwind CSS v4, ESLint v9 (flat config), and Vitest test scripts scaffolded.
- 2026-04-27 — Dashboard UI Phase 1: initialized shadcn/ui (components.json, theme tokens in globals.css, lib/utils, button primitive), defaulted the app to dark mode, and added the `/dashboard` route with sidebar + main layout placeholders.
- 2026-04-27 — Dashboard UI Phase 2: added shadcn sidebar/sheet/avatar/tooltip primitives, built `AppSidebar` (Hardware Hub header logo, three nav links with collapsed-icon tooltips, user footer from mock-data + logout placeholder), wired `SidebarProvider`/`TooltipProvider` into the dashboard layout with a mobile-only `SidebarTrigger` (drawer below 768px), and refactored `useIsMobile` to `useSyncExternalStore`.
