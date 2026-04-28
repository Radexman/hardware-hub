# Seed Data Specification

## Overview

Create a seed script (`prisma/seed.ts`) to populate the database with sample data for development and demos. Include all the initial mock data in the seed. Refer to the:

- @src/lib/mock-data.ts

## Requirements

### Admin User

- **Email:** admin@booksy.com
- **Name:** Alex Admin
- **Password:** admin123 (hash with bcryptjs, 12 rounds)
- **Role:** ADMIN
- **emailVerified:** current date

### Regular User

- **Email:** j.doe@booksy.com
- **Name:** John Doe
- **Password:** user123 (hash with bcryptjs, 12 rounds)
- **Role:** USER
- **emailVerified:** current date
