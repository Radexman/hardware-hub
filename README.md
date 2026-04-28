# Hardware Hub

An AI-powered internal tool for managing, renting, and maintaining company equipment at Booksy. Built as a recruitment-task deliverable.

> Submitted as a recruitment task. The seed data, user accounts, and demo credentials below are intentional fixtures meant for review.

## Demo accounts

The seeded database ships with three accounts. Use these to log in once authentication is wired up. All emails resolve to the seeded users — the passwords are stored as 12-round bcrypt hashes in the database.

| Role  | Email                | Password   | Notes                                                                |
| ----- | -------------------- | ---------- | -------------------------------------------------------------------- |
| Admin | `admin@booksy.com`   | `admin123` | "Alex Admin". Full CRUD + user management.                            |
| User  | `j.doe@booksy.com`   | `user123`  | "John Doe". Currently has `Apple MacBook Pro 13` rented.              |
| User  | `a.smith@booksy.com` | `user123`  | "Alice Smith". Currently has `Sony WH-1000XM4` rented.                |

> ⚠️ These credentials exist purely so reviewers can sign in. They are **not** suitable for any real deployment.

## Quick start

Prerequisites: Node 20.19+, a Neon Postgres database, and a `.env` file with `DATABASE_URL` set to the dev branch connection string.

```bash
npm install
npx prisma generate            # build the Prisma client into src/generated/prisma
npx prisma migrate dev         # apply schema migrations to the dev branch
npx prisma db seed             # populate the database with the demo data
npm run dev                    # start the Next.js dev server at http://localhost:3000
```

After seeding, visit [http://localhost:3000/hardware](http://localhost:3000/hardware) for the hardware list and [http://localhost:3000/my-rentals](http://localhost:3000/my-rentals) for the (currently hardcoded) John Doe's active rentals.

## Useful scripts

| Script                          | What it does                                                |
| ------------------------------- | ----------------------------------------------------------- |
| `npm run dev`                   | Next.js dev server (Turbopack)                              |
| `npm run build`                 | Production build                                            |
| `npm run lint`                  | ESLint (flat config, v9)                                    |
| `npx prisma migrate dev`        | Apply schema migrations against the dev Neon branch         |
| `npx prisma db seed`            | Run the seed script against the dev Neon branch (idempotent)|
| `npx tsx scripts/test-db.ts`    | Print users / items / rental history from the dev branch    |
| `npm run db:migrate:deploy:prod`| Apply migrations against the prod branch (`.env.production`) |
| `npm run db:seed:prod`          | Run the seed against the prod branch                        |
| `npm run db:test:prod`          | Print users / items / rental history from the prod branch   |

The `*:prod` scripts pipe `.env.production` through `dotenv-cli`, so the prod target is always explicit — there's no implicit "current env" to mistake for prod.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (dark mode by default) + **Lucide** icons
- **Prisma 7** with the `prisma-client` generator and `@prisma/adapter-neon` over `@neondatabase/serverless`
- **Neon** serverless Postgres (separate dev and prod branches)
- **bcryptjs** for password hashing
- Auth, AI semantic search, tests, and the admin panel are pending in later phases

## TODO (later README passes)

These will land as the matching features ship:

- [ ] Implementation status table (what works / what's mocked)
- [ ] Trade-offs and design decisions
- [ ] AI development log — prompts and decisions
- [ ] Screenshots of the live UI
- [ ] Deployed-URL link for reviewers
- [ ] Test plan + how to run the test suite
- [ ] Notes on the seed-data quality fixes from `context/project-overview.md`
