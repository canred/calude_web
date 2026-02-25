# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with hot reload (tsx + nodemon)
npm run build    # Compile TypeScript to dist/
npm run start    # Run compiled output from dist/
npm run lint     # Type-check without emitting (tsc --noEmit)
```

## Architecture

Node.js + Express + TypeScript API server.

- **Entry point**: `src/index.ts` — creates the Express app, mounts middleware and the router under `/api`
- **Routes**: `src/routes/index.ts` — add new `Router` instances here or split into separate files per resource
- **Middleware**: `src/middleware/` — place custom middleware here

TypeScript compiles from `src/` to `dist/` (CommonJS, ES2022 target). During development, `tsx` runs source directly without compiling.

## Database

SQLite via Prisma 7 + libSQL adapter.

- **Schema**: `prisma/schema.prisma` — defines models
- **Client**: `src/db.ts` — exports a singleton `prisma` instance
- **Generated client**: `src/generated/prisma/` — auto-generated, do not edit

```bash
npx prisma migrate dev --name <name>   # Create and apply a migration
npx prisma generate                    # Regenerate client after schema changes
npx prisma studio                      # Open visual DB browser
```

`DATABASE_URL` in `.env` defaults to `file:./prisma/dev.db`. Prisma 7 uses the libSQL driver adapter — the URL is passed via `PrismaLibSql` in `src/db.ts`, not in `schema.prisma`.
