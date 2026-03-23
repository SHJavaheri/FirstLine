# FirstLine Development Setup Guide

Welcome to FirstLine! This guide will walk you through setting up your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js 20+** - [Download here](https://nodejs.org/)
- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/)
- **npm** (comes with Node.js) or **pnpm**

## Setup Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd FirstLine
```

### 2. Navigate to Frontend Directory

```bash
cd frontend
```

### 3. Start PostgreSQL Database

Make sure Docker Desktop is running, then start the PostgreSQL database:

```bash
docker-compose up -d
```

This will:
- Download the PostgreSQL Docker image (if not already downloaded)
- Start a PostgreSQL container in the background
- Configure it to match the credentials in your `.env` file

**Note:** The `.env` file is already included in the repository with development credentials. No additional configuration needed!

### 4. Install Dependencies

```bash
npm install
```

This will install all required packages defined in `package.json`.

### 5. Setup Database Schema

Run the following commands in order:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate -- --name init

# Seed the database with demo data
npm run prisma:seed
```

**What these commands do:**
- `prisma:generate` - Creates the Prisma Client based on your schema
- `prisma:migrate` - Creates database tables and structure
- `prisma:seed` - Populates the database with demo data

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Demo Credentials

Once the app is running, you can log in with:

- **Email:** `owner@firstline-demo.com`
- **Password:** `Password123!`

## Useful Commands

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Database
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:migrate` - Create a new migration
- `npm run prisma:seed` - Re-seed the database

### Code Quality
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, you can specify a different port:
```bash
PORT=3001 npm run dev
```

### Database Connection Issues
If you can't connect to the database:
1. Ensure Docker Desktop is running
2. Check that the PostgreSQL container is running: `docker ps`
3. Restart the container: `docker-compose restart`

### Prisma Migration Fails / Port Conflict
If `npm run prisma:migrate` fails or you get a port conflict error, PostgreSQL port 5432 might already be in use on your machine. To fix this:

1. Open `docker-compose.yml` in the `frontend` directory
2. Change the port mapping from `"5432:5432"` to `"5433:5432"` (or another available port like 5434, 5435, etc.)
   - **Important:** Only change the FIRST number (host port), keep the second number as `5432`
3. Open `.env` in the `frontend` directory
4. Update the `DATABASE_URL` to match the new port:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5433/firstline
   ```
5. Restart Docker: `docker-compose down` then `docker-compose up -d`
6. Try the migration again: `npm run prisma:migrate -- --name init`

### Prisma Issues
If you encounter Prisma-related errors:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Run `npm run prisma:generate`

### Clean Start
To completely reset your development environment:
```bash
# Stop and remove Docker containers
docker-compose down -v

# Remove node_modules
rm -rf node_modules package-lock.json

# Reinstall and setup
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

## Project Structure

```
FirstLine/
├── docs/                    # Project documentation
├── frontend/                # Next.js full-stack application
│   ├── src/
│   │   ├── app/            # Next.js App Router (pages + API routes)
│   │   ├── backend/        # Business logic, services, repositories
│   │   ├── components/     # UI components
│   │   ├── database/       # Prisma client
│   │   ├── lib/            # Utilities and helpers
│   │   └── types/          # TypeScript types
│   ├── prisma/             # Database schema and migrations
│   ├── public/             # Static assets
│   └── .env                # Environment variables (committed for dev)
└── README.md
```

## Need Help?

- Check the main [README.md](README.md) for project overview
- Review the [documentation](docs/) folder for detailed guides
- Contact: northboundinc.hq@gmail.com

---

**Northbound**  
*The only way is up.*
