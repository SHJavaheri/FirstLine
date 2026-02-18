# FirstLine MVP

FirstLine is a production-ready MVP for discovering lawyers by specialization, location, hourly rate, and rating.

## Stack

- Next.js (App Router) + TypeScript
- TailwindCSS + shadcn-style UI components
- Next.js route handlers for backend APIs
- PostgreSQL + Prisma ORM
- Email/password auth with JWT session cookies

## Project Structure

```txt
frontend/
  src/
    app/                  # App Router pages + API routes
    app/api/              # Backend route handlers
    backend/              # Business logic, repositories, validators
    components/           # Reusable UI and feature components
    database/             # Prisma client singleton
    lib/                  # Utility/env helpers
    types/                # Shared TypeScript types
  prisma/                 # Prisma schema and seed script
  backend/                # Requested top-level architecture folder
  database/               # Requested top-level architecture folder
  components/             # Requested top-level architecture folder
  lib/                    # Requested top-level architecture folder
  types/                  # Requested top-level architecture folder
  api/                    # Requested top-level architecture folder
```

## Setup

1. Copy environment values:

```bash
cp .env.example .env
```

2. Update `.env`:

- `DATABASE_URL`: PostgreSQL connection URL
- `JWT_SECRET`: long random string (32+ chars)

3. Install dependencies:

```bash
npm install
```

4. Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

5. Seed demo data:

```bash
npm run prisma:seed
```

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Demo Credentials

- Email: `owner@firstline-demo.com`
- Password: `Password123!`

## Deployment (Vercel)

1. Push repository to Git provider.
2. Import project in Vercel.
3. Set environment variables (`DATABASE_URL`, `JWT_SECRET`).
4. Configure build command:

```bash
npm run prisma:generate && next build
```

5. Configure post-deploy migration command:

```bash
npm run prisma:deploy
```
