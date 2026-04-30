# Dashboard Collections Spec

## Overview

Replace the dummy collection data displayed in the main area of the dashboard (right side), with actual data from the database. It should look how it does now, but instead of using data from @src/lib/mock-data.ts, it should be from our Neon database using Prisma.

## Requirements

- Create src/lib/db/items.ts with data fetching functions
- Fetch items directly in server component
- Keep the current design. You can also reference the screenshot

## References

Check the `@context/screenshots/user-hardware-list.png` screenshot if needed, but layout and design is already there.
