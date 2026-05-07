## Velore Backend (Node.js + Express + Prisma + PostgreSQL)

This folder contains the backend API for the Velore eyewear e-commerce project.

## Local setup

1. Create `.env` (local only):

- Copy `.env.example` → `.env`
- Update DB credentials if your local Postgres password differs
- `.env` must **NOT** be committed (it is gitignored)

2. Install dependencies:

```bash
npm install
```

3. Start Postgres + pgAdmin (Docker):

```bash
docker compose up -d postgres pgadmin
```

4. Prisma:

```bash
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
```

5. Run the server:

```bash
npm run dev
```

Health:

- `GET /health`

## Useful scripts

- `npm run db:validate`
- `npm run db:format`
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:seed`
- `npm run db:studio`

`npm run db:reset` is **local-development only** and destructive.

## Security notes

- `GET /api/v1/loyalty/points` and `POST /api/v1/loyalty/redeem` require a **customer JWT**.
- `POST /api/v1/loyalty/award` and `GET /api/v1/loyalty/:userId` require an **admin JWT**.

