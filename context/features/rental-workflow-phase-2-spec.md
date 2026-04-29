# Rental Workflow — Phase 2

## Overview

Enhance the core rental workflow with improved UX, deadline selection, feedback states, and interaction polish. Phase 1 established rent/return business logic; this phase improves usability, visibility, and user confidence around rental actions.

Focus on making the workflow feel reliable, guided, and production-ready.

This phase includes:

- Rent confirmation flow
- Return confirmation flow
- Rental deadline selection
- Toast feedback and loading states
- Overdue and due-soon visual warnings
- Optimistic UI and action-state polish

## Requirements

## Rent Experience

Before renting:

- Clicking Rent opens confirmation modal (shadcn Dialog)

Modal should include:

- Item summary
- Current status
- Return deadline selector
- Confirm Rent action
- Cancel action

Return deadline:

- Allow user to choose deadline before renting
- Provide preset options:
    - 7 days
    - 14 days
    - 30 days
- Default to 14 days

On success:

- Close modal
- Update UI immediately
- Show success toast

## Return Experience

Clicking Return opens confirmation modal.

Modal includes:

- Rented item summary
- Return confirmation prompt
- Confirm Return action
- Cancel action

On success:

- Close modal
- Update UI immediately
- Show success toast

## Feedback States

Add toast feedback using shadcn Sonner:

Success:

- Device rented successfully
- Device returned successfully

Errors:

- Item unavailable
- Rental failed
- Return failed
- Permission guard failures

## Loading + Action States

Add:

- Loading state on action buttons
- Disabled state while mutation pending
- Prevent duplicate submissions
- Action spinner indicators

## Due Date Warnings

Add visual deadline indicators in My Rentals:

States:

- Normal due date
- Due soon warning
- Overdue warning

Support:

- Status badge treatment
- Optional pulse attention state for overdue items

## Optimistic UX

Improve perceived responsiveness:

- Optimistically update item state after actions
- Keep server truth authoritative
- Roll back gracefully on failure

## UI Polish

Enhance item interactions:

- Better action affordances
- Hover-state improvements
- Clear disabled states for unavailable actions
- Consistent motion/transition behavior

## Files to Create / Update

1. Rent confirmation modal
2. Return confirmation modal
3. Deadline selector component
4. Toast integration
5. My Rentals due-state indicators
6. Action state handling on item cards

## Technical Expectations

- Reuse business logic from Phase 1
- Keep confirmations separate from mutation logic
- Reuse shadcn dialog + toast primitives
- Preserve server action authority
- Keep optimistic updates resilient

## Key Gotchas

Use Context7 to verify latest shadcn/Sonner patterns.

- Do not duplicate business logic in modal layer
- Keep deadline UI separate from rental mutation rules
- Avoid stale optimistic states
- Ensure overdue logic uses reliable date calculations
- Prevent multiple submissions from repeated clicks

## Testing

1. Rent confirmation modal opens and submits correctly
2. Return confirmation modal works correctly
3. Deadline selection persists on rental
4. Success toasts display
5. Error states display correctly
6. Buttons disable during pending states
7. Due soon warnings render correctly
8. Overdue warnings render correctly
9. Optimistic UI reconciles correctly after mutation

## References

- @context/project-overview.md
- Existing item card rent actions
- Existing my-rentals return actions
- Existing shadcn dialog usage
- Existing toast/sonner patterns
- https://ui.shadcn.com/docs/components/dialog
- https://ui.shadcn.com/docs/components/sonner
