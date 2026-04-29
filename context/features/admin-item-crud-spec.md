# Admin Item Management MVP

## Overview

Extend Admin Panel item management from scaffold into minimal functional inventory administration focused on core MVP mutations.

Scope is intentionally limited to:

- Create device persistence
- Edit device workflow
- Repair status toggle

Deferred:

- Device deletion
- Advanced inventory administration flows

Reuse existing inventory card/list architecture and admin UI patterns.

## Requirements

## Create Device

Upgrade existing "Add Device" modal from scaffold to real create flow.

On create:

- Persist new item in database

Required fields:

- Name
- Brand
- Purchase date
- Status

Optional:

- Notes

On success:

- Close modal
- Refresh inventory
- Show success feedback

On failure:

- Show validation or mutation errors

## Edit Device

Enable per-item Edit action.

Requirements:

- Reuse Add Device form in edit mode
- Prefill existing item data
- Persist item updates

Editable fields:

- Name
- Brand
- Purchase date
- Status
- Notes

On success:

- Refresh inventory
- Show success feedback

## Repair Toggle

Enable quick repair toggle per item.

Behavior:

- AVAILABLE → REPAIR
- REPAIR → AVAILABLE

Rules:

- Items in `IN_USE` cannot enter repair
- Items in `REPAIR` remain unavailable for rental

On success:

- Update item state
- Refresh UI
- Show feedback

## Inventory Behavior

Reuse existing:

- Item cards
- Grid/list views
- Search and sort controls
- Existing inventory layout

## Data + Persistence

Use Prisma-backed database as source of truth.

Implement:

- Create mutation
- Update mutation
- Repair toggle mutation

Use server-side mutations only.

## Files to Create / Update

1. Item create server action
2. Item update server action
3. Repair toggle action
4. Add/Edit device modal integration
5. Admin item action wiring

## Technical Expectations

- Use server actions / App Router patterns
- Reuse shared form for create/edit
- Centralize item mutation logic
- Revalidate inventory after mutations

## Key Gotchas

Use Context7 to verify current server action conventions.

- Prevent repair toggles on in-use devices
- Keep repair rules aligned with rental workflow
- Avoid duplicating create/edit form logic
- Respect migration discipline (no db push)

## Testing

1. Admin can create device
2. Admin can edit device
3. Repair toggle rules enforced

## References

- @context/project-overview.md
- @context/screenshots/admin-panel.png
- @context/screenshots/item-create.png
- Admin Panel Phase 1 spec
- Rental Workflow specs
- Prisma Item model
- Existing inventory card architecture
- https://ui.shadcn.com/docs/components/dialog
- https://ui.shadcn.com/docs/components/form
