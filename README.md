# HR Assist

Internal employee management and attendance system.

## Documentation

- 🇵🇱 [Specyfikacja biznesowo-techniczna (PL)](./docs/SPECIFICATION.pl.md)
- 🇬🇧 [Technical Specification (EN)](./docs/SPECIFICATION.en.md)
- [Frontend Development Plan](./FRONTEND_PLAN.md)

## Frontend (MVP)

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
pnpm --filter web dev
```

Open [http://localhost:3000/login](http://localhost:3000/login). Mock API mode is enabled by default (`NEXT_PUBLIC_USE_MOCK=true`).
