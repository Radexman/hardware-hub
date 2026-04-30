# Admin Panel — Phase 1

## Overview

Build the `/admin` route focused on hardware inventory management only (user management comes in Phase 2).

Reuse the existing Hardware Hub card architecture and patterns from Hardware List/My Rentals rather than introducing a table-heavy admin UI. Admin inventory should use the existing grid/list views, sorting/filter controls, status indicators, and fetch data from the Prisma-backed device catalogue.

This phase includes:

- Admin inventory view using reusable item cards/list layouts
- Per-item admin action affordances (Edit, Repair, Delete — visual only for now)
- "Add Device" flow using shadcn Dialog + form (log submitted item only for now, no real CRUD yet)

## Requirements

- Create `/admin` route using existing app sidebar layout

- Reuse existing item architecture:
    - Current grid + list view modes
    - Left status border pattern
    - Existing sort/filter controls
    - Current item content structure
    - Load devices from DB catalogue, not mock data

- Admin inventory:
    - Show all devices
    - Support sorting by Name, Brand, Date, Status
    - Keep current search/filter UX
    - Preserve cyan active filter styles
    - Maintain existing responsive behavior

- Add Device:
    - Cyan "Add Device" action in admin toolbar
    - Opens shadcn Dialog modal
    - Form fields:
        - Name (text)
        - Brand (select)
        - Purchase Date (date)
        - Status (select)
        - Notes (optional textarea)
    - Cancel + Create actions
    - Use existing dark theme/shadcn form styling
    - For now submission only logs data (no persistence)

- Validation:
    - Required fields enforced
    - Prevent invalid submissions
    - Valid status enum only

- Card admin actions:
    - Show Edit / Delete / Toggle Repair controls per item
    - Non-interactive placeholders only in this phase

- UX:
    - Keep cards as primary inventory UI (not management table)
    - Preserve current hover states and micro-interactions
    - Add loading skeleton state for inventory fetch

- Technical:
    - Reuse existing components where possible
    - Favor composition over duplicated card logic
    - Follow current App Router/server patterns
    - No schema changes in this phase

- Testing:
    - Inventory loads from DB
    - Add Device form validates correctly
    - Form submission logs expected payload

## References

- @context/project-overview.md
- @context/screenshots/admin-panel.png
- @context/screenshots/item-create.png
- @src/lib/db/items.ts
- @src/lib/mock-data.ts
- Existing hardware list card architecture
- Existing my-rentals view toggle implementation
- https://ui.shadcn.com/docs/components/dialog
- https://ui.shadcn.com/docs/components/form
- https://ui.shadcn.com/docs/components/select
