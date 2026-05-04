# Item Categories + Inventory Toolbar UI Refactor

## Overview

Enhance the inventory system by introducing **item categories (device types)** and refactoring the **filtering UI into a cohesive toolbar**.

This combines **data structure improvements** with **UI/UX polish** to create a more intuitive and production-quality inventory experience.

**This phase implements:**

- Item category field (DB + UI)
- Category-based filtering
- Icon-based visual identification (Lucide)
- Unified inventory toolbar (search + filters + view toggle)

---

## Goals

- Add structured categorization to inventory items
- Improve visual clarity with category icons
- Enable filtering by item type
- Refactor filtering UI into a clean, consistent toolbar
- Improve overall UX without overengineering

---

## Scope

### Data Layer

- Add `category` to `Item` model
- Update seed data
- Update create/edit flows

### UI Layer

- Add category filter
- Add icons to item cards
- Refactor toolbar layout

---

## Item Categories

### Category Type

```ts
type ItemCategory =
  | "LAPTOP"
  | "PHONE"
  | "TABLET"
  | "MOUSE"
  | "KEYBOARD"
  | "OTHER";
```

### Prisma Schema

Update the `Item` model:

```prisma
model Item {
  id           String
  name         String
  brand        String
  category     ItemCategory
  status       ItemStatus
  purchaseDate DateTime?
  assignedTo   String?
  notes        String?
}

enum ItemCategory {
  LAPTOP
  PHONE
  TABLET
  MOUSE
  KEYBOARD
  OTHER
}
```

### Migration

- Create a new Prisma migration
- `category` is a required field

### Existing Data Handling

Update `prisma/seed.ts` with the following mappings, then reseed the DB:

| Item Type | Category |
|-----------|----------|
| MacBook | `LAPTOP` |
| iPhone | `PHONE` |
| iPad | `TABLET` |
| Logitech Mouse | `MOUSE` |
| Keyboard | `KEYBOARD` |
| Other | `OTHER` |

---

## Create / Edit Device

### Form Updates

Extend `device-form.tsx` by adding a `category` field using a `Select` component with the following options: Laptop, Phone, Tablet, Mouse, Keyboard, Other.

### Validation

```ts
category: z.enum(["LAPTOP", "PHONE", "TABLET", "MOUSE", "KEYBOARD", "OTHER"])
```

### Behavior

- Required field
- Default: `OTHER` (optional)

---

## Item Card UI

### Icon Mapping (Lucide)

| Category | Icon |
|----------|------|
| `LAPTOP` | `Laptop` |
| `PHONE` | `Smartphone` |
| `TABLET` | `Tablet` |
| `MOUSE` | `Mouse` |
| `KEYBOARD` | `Keyboard` |
| `OTHER` | `Package` |

### Implementation

Create a utility function:

```ts
getItemIcon(category: ItemCategory)
```

Render the icon in the card header, next to the item name.

---

## Inventory Toolbar UI Refactor

### Layout

**Desktop — single-line toolbar:**

```
[ Search ] [ Status ] [ Category ] [ Sort ]        [ View Toggle ]
```

**Mobile — wrapped:**

```
[ Search  ]
[ Filters ]
[ Toggle  ]
```

### Toolbar Container

```tsx
<div className="flex items-center justify-between gap-4 flex-wrap">
```

---

### Search Input

Replace the current full-width input with a constrained width:

```tsx
className="w-full max-w-sm"
```

- Keep existing search logic (fuzzy + AI toggle)
- Maintain the search icon
- No backend changes

---

### Filters Group

```tsx
<div className="flex items-center gap-2 flex-wrap">
```

**Includes:** Status filter, Category filter, Sort control.

---

### Category Filter

**Options:** All (default), Laptop, Phone, Tablet, Mouse, Keyboard, Other.

**Behavior:**

- Client-side filtering
- Works in combination with search, status, and sort

---

### Status Filter

- Keep existing logic and behavior
- Align visually with the category filter

---

### Sort Control

**Options:** Name, Brand, Date, Status.

- Keep existing implementation
- Align UI with other filter components

---

### View Toggle

Position on the far right — no logic changes:

```tsx
<ViewToggle />
```

---

## Visual Guidelines

- `gap-4` between major toolbar sections
- `gap-2` inside the filters group
- Consistent heights across all inputs and selects
- All controls vertically centered

---

## Filtering Logic

Extend the existing filter chain:

```ts
filteredItems = items
  .filter(search)
  .filter(status)
  .filter(category)
  .sort(...)
```

---

## Data + Persistence

**Update:**

- Create item mutation → include `category`
- Update item mutation → include `category`

**No changes to:**

- Rental logic
- Repair logic

---

## Files to Update

### Data

| # | File |
|---|------|
| 1 | Prisma schema |
| 2 | Migration |
| 3 | Seed file |

### UI

| # | File |
|---|------|
| 4 | `device-form.tsx` |
| 5 | Item card component |
| 6 | Inventory toolbar (`HardwareList`) |
| 7 | `AdminInventory` |
| 8 | Category filter logic |
| 9 | Icon utility (`getItemIcon`) |

---

## Technical Expectations

- Use Prisma enums for `ItemCategory`
- Keep types consistent across DB, Zod schema, and frontend
- Keep filtering client-side
- Avoid UI overengineering

---

## Key Gotchas

- Must reseed DB due to the new required `category` field
- Ensure all seeded items have a valid category value
- Keep the enum in sync across all layers (DB, Zod, types)
- Do not break existing search/status/sort filters
- Avoid mixing inconsistent UI components in the toolbar

---

## Expected Result

| | Before | After |
|---|--------|-------|
| Data | No item categorization | Structured inventory data |
| Visuals | Weak differentiation | Icon-based visual clarity |
| Toolbar | Fragmented filter UI | Clean, unified toolbar |
| Search | Overly dominant | Balanced and constrained |
| Overall | Functional but rough | Better UX and discoverability |
