# HR Assist — Web Frontend

Next.js frontend for the HR Assist MVP (`apps/web`).

## Requirements

- Node.js 20+
- [pnpm](https://pnpm.io/) 10.x (see root `package.json` → `packageManager`)

## Commands

From the repository root:

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web lint
```

From `apps/web`:

```bash
pnpm dev
pnpm build
pnpm lint
```
