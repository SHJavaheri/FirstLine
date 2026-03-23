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
      api/                # Backend route handlers
    backend/              # Business logic, repositories, validators
    components/           # Reusable UI and feature components
    database/             # Prisma client singleton
    lib/                  # Utility/env helpers
    types/                # Shared TypeScript types
  prisma/                 # Prisma schema and seed script
  public/                 # Static assets
  package.json            # Dependencies and scripts
```

## Setup

> **Zero Configuration Required!** The `.env` file is already configured with working local development values. Just follow the steps below.

1. Install dependencies:

```bash
npm install
```

2. Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

3. Seed demo data:

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

## Environment Variables

The `.env` file is committed to the repository with development-only credentials for convenience. This allows zero-configuration local setup.

**⚠️ For Production Deployment:**
- **NEVER** use the committed `.env` values in production
- Set environment variables through your hosting platform (Vercel, AWS, etc.)
- Use secure secret management for `JWT_SECRET`
- Use a production database for `DATABASE_URL`

## Deployment (Vercel)

1. Push repository to Git provider.
2. Import project in Vercel.
3. Set environment variables (`DATABASE_URL`, `JWT_SECRET`) - **DO NOT use the values from `.env`**
4. Configure build command:

```bash
npm run prisma:generate && next build
```

5. Configure post-deploy migration command:

```bash
npm run prisma:deploy
```
