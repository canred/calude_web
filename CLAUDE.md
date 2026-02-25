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
