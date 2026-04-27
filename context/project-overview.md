# 🔧 Hardware Hub — Project Overview

> **One clean, AI-powered internal tool for managing, renting, and maintaining company equipment at Booksy.**

---

## 🎯 Problem

Company hardware management is a mess when done manually:

- 📋 Equipment tracked in scattered spreadsheets or not at all
- 🔄 No clear rental flow — people grab devices without logging it
- 🛠️ Broken devices stay in circulation because nobody flags them
- 🔍 Finding the right device means asking around or checking desks
- 👤 No accountability — "who has the MacBook?" becomes a daily question
- 📊 Admins have zero visibility into fleet health, usage, or availability

The result: lost equipment, wasted time, and zero oversight. **Hardware Hub centralizes it all into a single, fast, AI-enhanced management system.**

---

## 👥 Target Users

| Persona              | Needs                                                                  |
| -------------------- | ---------------------------------------------------------------------- |
| **Employee**         | Browse available hardware, rent devices quickly, track return deadlines |
| **Power User**       | Semantic search ("I need a phone for testing"), rental history at hand  |
| **IT Admin**         | Full CRUD over inventory, repair management, user account creation     |
| **Team Lead**        | Visibility into who has what, fleet status at a glance                 |

---

## ✨ Features

### A. Hardware Items

Items are the core entity of Hardware Hub. Each device in the system is an **Item** with properties:

| Field          | Description                                      | Example                    |
| -------------- | ------------------------------------------------ | -------------------------- |
| `name`         | Device name / model                              | "Apple iPhone 13 Pro Max"  |
| `brand`        | Manufacturer                                     | "Apple"                    |
| `purchaseDate` | Date the device was acquired                     | 2021-11-23                 |
| `status`       | Current state of the device                      | Available / In Use / Repair |
| `assignedTo`   | Email of current renter (nullable)               | "j.doe@booksy.com"         |
| `returnDate`   | Expected return deadline (nullable)              | 2026-05-15                 |
| `notes`        | Free-text notes (damage history, warnings, etc.) | "Battery swelling"         |

**Status lifecycle:**

```
Available ──→ In Use ──→ Available
    │                        ↑
    ↓                        │
  Repair ────────────────────┘
```

**Guards / business rules:**
- Only items with status `Available` can be rented
- Only items with status `In Use` can be returned
- Items in `Repair` cannot be rented
- Admins can toggle any item to/from `Repair`
- Renting sets `status → In Use`, assigns user email, and sets a return deadline
- Returning sets `status → Available`, clears `assignedTo` and `returnDate`

### B. Authentication & Roles

Two roles in the system:

| Role      | Access                                                                 |
| --------- | ---------------------------------------------------------------------- |
| **User**  | Browse hardware, rent/return devices, view own rentals                 |
| **Admin** | Everything a User can do + full CRUD on items + manage user accounts   |

- Login via email/password only
- Only admins can create new accounts (no self-registration)
- A default admin account is seeded on first run

### C. Pages & Navigation

| Page               | Route          | Description                                                     |
| ------------------ | -------------- | --------------------------------------------------------------- |
| **Login**          | `/login`       | Simple login screen, only pre-created users can access          |
| **Hardware List**  | `/hardware`    | Main dashboard — all items with sorting, filtering, and AI search |
| **My Rentals**     | `/my-rentals`  | User's currently rented items with return deadlines             |
| **Admin Panel**    | `/admin`       | Full item management + user account creation (admin-only)       |

### D. AI-Native Layer — Semantic Search

Powered by **OpenAI `gpt-5-nano`**:

- 🔍 **Semantic Search** — natural language queries at the top of the Hardware List page
  - "I need something to test a mobile app on" → returns iPhones, iPads, Androids
  - "Give me a laptop for development" → returns MacBooks, Dell XPS
  - "I need headphones for a call" → returns Sony WH-1000XM4
- The AI interprets user intent and matches it against item names, brands, notes, and categories
- Falls back to standard text search when AI is unavailable

### E. Search, Sort & Filter

Available on the Hardware List page:

- **Search**: AI-powered semantic search input at the top of the page
- **Sort by**: Name (A-Z / Z-A), Brand, Purchase Date (newest/oldest), Status
- **Filter by**: Status (Available, In Use, Repair), Brand

### F. Admin Features

- **Add Device** — opens a shadcn modal with form fields: name, brand, purchase date, status, notes
- **Edit Device** — inline edit or modal for updating device properties
- **Delete Device** — with confirmation dialog
- **Toggle Repair** — quick action to send a device to/from repair status
- **Manage Accounts** — create new user accounts (email + password + role)

### G. Quality-of-life Features

- 🔔 Toast notifications for all key actions (rent, return, add, delete, errors)
- 🕒 Return deadline warnings on My Rentals page
- 📱 Responsive layout (desktop-first, mobile-friendly)
- 🌙 Dark mode by default, light mode toggle
- ⏳ Loading skeletons for async data
- ✨ Smooth transitions and hover states

---

## 🗄️ Data Model

> ⚠️ **Rough draft** — schema will evolve during implementation. Not final.

### Entity Relationships

```
User ──┬──< Item (as renter, via assignedTo)
       │
       └──< RentalHistory (log of all rent/return events)

Item ──< RentalHistory
```

### Prisma Schema (Draft)

```prisma
// ⚠️ ROUGH DRAFT — subject to change during implementation

model User {
  id             String          @id @default(cuid())
  email          String          @unique
  name           String?
  password       String          // hashed
  role           Role            @default(USER)
  image          String?
  // Relations
  rentals        RentalHistory[]
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
}

enum Role {
  USER
  ADMIN
}

model Item {
  id             String          @id @default(cuid())
  name           String
  brand          String
  purchaseDate   DateTime?
  status         ItemStatus      @default(AVAILABLE)
  assignedTo     String?         // email of current renter
  returnDate     DateTime?       // expected return deadline
  notes          String?         // free-text: damage history, warnings
  // Relations
  assignedUser   User?           @relation(fields: [assignedTo], references: [email])
  rentalHistory  RentalHistory[]
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  @@index([status])
  @@index([assignedTo])
  @@index([brand])
}

enum ItemStatus {
  AVAILABLE
  IN_USE
  REPAIR
}

model RentalHistory {
  id             String          @id @default(cuid())
  action         RentalAction    // RENT or RETURN
  // Relations
  itemId         String
  item           Item            @relation(fields: [itemId], references: [id], onDelete: Cascade)
  userId         String
  user           User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  // Metadata
  note           String?         // optional note on rent/return event
  createdAt      DateTime        @default(now())

  @@index([itemId])
  @@index([userId])
}

enum RentalAction {
  RENT
  RETURN
}
```

> 🚨 **Migration rule:** Never use `prisma db push`. All schema changes go through proper migrations (`prisma migrate dev` → `prisma migrate deploy`).

---

## 🌱 Seed Data

The initial dataset contains **intentional data quality issues** to test validation and auditing:

| Issue                        | Item ID | Description                                              |
| ---------------------------- | ------- | -------------------------------------------------------- |
| Duplicate ID                 | 4       | Two items share id=4 (Samsung Galaxy S21 & Lenovo laptop)|
| Contradictory status + notes | 5       | Status "Available" but notes warn about battery swelling |
| Future purchase date         | 6       | purchaseDate is 2027-10-10 (in the future)               |
| Brand typo                   | 9       | Brand is "Appel" instead of "Apple"                      |
| Non-standard date format     | 9       | purchaseDate is "22-05-2023" instead of ISO format       |
| Missing data                 | 10      | Empty brand, null date, invalid "Unknown" status         |
| Status vs history mismatch   | 11      | Status "Available" but history notes liquid damage       |

These should be **cleaned and normalized** during the seed migration. Document all decisions in the README.

---

## 🛠️ Tech Stack

### Framework & Language

- **[Next.js 16](https://nextjs.org/)** / **React 19** — SSR pages with dynamic components, API routes for backend, single codebase
- **[TypeScript](https://www.typescriptlang.org/)** — type safety end-to-end

### Database & ORM

- **[Neon](https://neon.tech/)** — serverless Postgres in the cloud
- **[Prisma 7](https://www.prisma.io/docs)** (latest — check docs) — ORM and migrations

### Auth

- **[NextAuth v5](https://authjs.dev/)** — credentials provider (email + password), admin-created accounts only

### AI

- **[OpenAI `gpt-5-nano`](https://platform.openai.com/docs)** — semantic search over hardware inventory

### Styling & UI

- **[Tailwind CSS v4](https://tailwindcss.com/)** — utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** — component library (dialogs, toasts, tables, forms, dropdowns)
- **[Lucide](https://lucide.dev/)** — icon set (matches shadcn)

---

## 🎨 UI / UX

### Design Direction

**Industrial-utilitarian meets developer tooling.** Think clean, dense, information-rich — like a well-designed ops dashboard. Dark mode by default with a muted, high-contrast palette. No unnecessary decoration — every pixel serves a purpose. The tool should feel fast, professional, and transparent.

**References:** [Linear](https://linear.app) · [Vercel Dashboard](https://vercel.com) · [Retool](https://retool.com)

### Color System

| Token                | Hex         | Usage                                        |
| -------------------- | ----------- | -------------------------------------------- |
| `--background`       | `#09090b`   | App background (zinc-950)                    |
| `--surface`          | `#18181b`   | Cards, sidebar, modals (zinc-900)            |
| `--surface-hover`    | `#27272a`   | Hover states (zinc-800)                      |
| `--border`           | `#3f3f46`   | Borders, dividers (zinc-700)                 |
| `--text-primary`     | `#fafafa`   | Primary text (zinc-50)                       |
| `--text-secondary`   | `#a1a1aa`   | Muted text, labels (zinc-400)                |
| `--accent`           | `#22d3ee`   | Primary accent — cyan-400                    |
| `--accent-hover`     | `#06b6d4`   | Accent hover — cyan-500                      |
| `--status-available` | `#4ade80`   | Available badge — green-400                  |
| `--status-in-use`    | `#facc15`   | In Use badge — yellow-400                    |
| `--status-repair`    | `#f87171`   | Repair badge — red-400                       |
| `--danger`           | `#ef4444`   | Destructive actions — red-500                |

### Typography

| Role        | Font                                               | Weight     | Size       |
| ----------- | -------------------------------------------------- | ---------- | ---------- |
| **Display** | `"JetBrains Mono"` (monospace, techy feel)         | 700        | 24-32px    |
| **Headings**| `"JetBrains Mono"`                                 | 600        | 18-24px    |
| **Body**    | `"Geist Sans"` (clean, modern, Vercel's typeface)  | 400 / 500  | 14-16px    |
| **Mono**    | `"JetBrains Mono"`                                 | 400        | 13-14px    |

### Icons

All icons from **Lucide**. Key mappings:

| Context             | Icon              |
| ------------------- | ----------------- |
| Hardware List       | `Monitor`         |
| My Rentals          | `Package`         |
| Admin Panel         | `Shield`          |
| Add Device          | `Plus`            |
| Edit                | `Pencil`          |
| Delete              | `Trash2`          |
| Repair              | `Wrench`          |
| Rent                | `ArrowRightLeft`  |
| Return              | `Undo2`           |
| Search              | `Search`          |
| AI Search           | `Sparkles`        |
| User                | `User`            |
| Logout              | `LogOut`          |
| Status: Available   | `CircleCheck`     |
| Status: In Use      | `Clock`           |
| Status: Repair      | `AlertTriangle`   |

### Layout

```
┌──────────────┬───────────────────────────────────────────┐
│              │  ┌─────────────────────────────────────┐  │
│   Sidebar    │  │  🔍 AI Semantic Search Bar          │  │
│              │  └─────────────────────────────────────┘  │
│  ┌────────┐  │                                           │
│  │  Logo  │  │  Sort: [Name ▼] [Brand ▼] [Date ▼]       │
│  └────────┘  │  Filter: [Status ▼] [Brand ▼]            │
│              │                                           │
│  📋 Hardware │  ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│     List     │  │  Item   │ │  Item   │ │  Item   │     │
│              │  │  Card   │ │  Card   │ │  Card   │     │
│  📦 My       │  │ ● Avail │ │ ● InUse │ │ ● Repair│     │
│     Rentals  │  └─────────┘ └─────────┘ └─────────┘     │
│              │                                           │
│  🛡️ Admin    │  ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│     Panel    │  │  Item   │ │  Item   │ │  Item   │     │
│              │  │  Card   │ │  Card   │ │  Card   │     │
│  ──────────  │  └─────────┘ └─────────┘ └─────────┘     │
│  👤 User     │                                           │
│  🚪 Logout   │                                           │
│              │                                           │
└──────────────┴───────────────────────────────────────────┘
```

- **Sidebar** (left, collapsible): Logo at top, navigation links (Hardware List, My Rentals, Admin Panel), user info and logout at bottom
- **Main content** (right): AI search bar at top, sort/filter controls below, then a responsive grid of item cards
- **Item cards**: show name, brand, status badge (color-coded), purchase date — with hover state revealing quick actions (Rent / Return)
- **Add Device**: opens a shadcn `Dialog` modal with form fields
- **Toasts**: shadcn `Sonner` toasts for all feedback (success, error, warnings)

### Responsive Behavior

- **Desktop** (≥1024px): full sidebar + main content grid
- **Tablet** (768–1023px): sidebar collapses to icon-only rail, content adjusts
- **Mobile** (<768px): sidebar becomes a hamburger drawer, cards stack vertically

### Micro-interactions

- Smooth page transitions between routes
- Hover states on all cards (subtle scale + shadow lift)
- Toast notifications via Sonner for every action (rent, return, add, delete, repair toggle)
- Loading skeletons for data fetching states
- Status badge pulse animation for items due for return soon
- Modal enter/exit transitions
- Button press feedback (subtle scale down)

---

## 🧪 Testing Requirements

Minimum **3 critical tests** (as per task requirements):

1. **Cannot rent hardware in Repair status** — attempting to rent a device with `status: REPAIR` returns an error
2. **Cannot rent hardware already In Use** — attempting to rent a device with `status: IN_USE` returns an error
3. **Cannot return hardware that is not In Use** — attempting to return a device with `status: AVAILABLE` or `REPAIR` returns an error

Additional suggested tests:

4. **Renting sets correct status and assignee** — after renting, item status is `IN_USE` and `assignedTo` matches user
5. **Only admins can access admin routes** — non-admin users get redirected from `/admin`
6. **Seed data issues are handled** — duplicate IDs resolved, invalid dates normalized, typos corrected

---

## 📋 Suggested Implementation Order

1. Initialize Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui
2. Set up Neon database and Prisma 7 with initial migration
3. Clean and seed initial dataset (document all data quality fixes)
4. Configure NextAuth v5 with credentials provider + role-based access
5. Build Login page
6. Build sidebar layout + routing (Hardware List, My Rentals, Admin Panel)
7. Build Hardware List page — item cards grid + sorting + filtering
8. Build Rent/Return flow with business logic guards
9. Build My Rentals page — user's active rentals with return deadlines
10. Build Admin Panel — item CRUD (add modal, edit, delete, repair toggle) + user management
11. Integrate OpenAI `gpt-5-nano` for semantic search
12. Write critical tests (min. 3)
13. Add toasts, loading states, micro-interactions
14. Write README.md with implementation status, trade-offs, and AI development log
