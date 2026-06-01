# PromptForge AI

PromptForge AI is a production-ready Next.js 15 application for creating, organizing, and refining reusable AI prompts.

## Stack

- Next.js 15 App Router
- TypeScript
- TailwindCSS
- Shadcn UI
- PostgreSQL
- Prisma
- Better Auth
- Zustand

## Getting Started

1. Install dependencies:

```sh
npm install
```

2. Create an environment file:

```sh
cp .env.example .env
```

3. Update `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL`. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to enable Google OAuth.

4. Generate Prisma client and run migrations:

```sh
npm run db:generate
npm run db:migrate
```

5. Start the development server:

```sh
npm run dev
```

## Quality Checks

```sh
npm run lint
npm run typecheck
npm run build
```

## Structure

- `src/app`: App Router routes, layouts, loading states, and error boundaries.
- `src/components`: Reusable UI, layout, and feedback components.
- `src/features`: Feature-owned components, server logic, schemas, stores, and types.
- `src/lib`: Auth, database, environment, errors, and utilities.
- `src/stores`: Global Zustand stores.
- `prisma`: Prisma schema and migrations.
