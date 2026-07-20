# Kopi Teduh Roastery

The storefront for **Kopi Teduh Roastery**, a specialty coffee roastery in Poso, Sulawesi
Tengah — a bilingual (Indonesian / English) catalog of single-origin lots with a cart that
hands off to WhatsApp.

There is deliberately no online checkout and no payment integration. The cart lives in the
browser; ordering opens WhatsApp with a pre-filled message, and shipping and payment are
settled in the chat. That matches how the business already sells.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Prisma 7 + MariaDB · Tailwind v4 ·
MUI 7 (admin template only) · pnpm

## Getting started

Requires Node 20+, pnpm, and a MySQL/MariaDB server (Laragon locally).

```bash
pnpm install                 # runs build:icons on postinstall
cp .env.example .env         # then set DATABASE_URL
pnpm db:migrate              # create the schema
pnpm db:seed                 # load the catalog
pnpm dev
```

Open <http://localhost:3000> — `/` redirects to `/id`.

## Commands

| Command | Does |
| --- | --- |
| `pnpm dev` | Dev server with turbopack |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm lint` / `pnpm lint:fix` | ESLint |
| `pnpm format` | Prettier over `src/**` |
| `pnpm build:icons` | Rebuild the bundled icon CSS |
| `pnpm db:generate` | `prisma generate` |
| `pnpm db:migrate` | `prisma migrate dev` |
| `pnpm db:seed` | Reseed the catalog |
| `pnpm db:studio` | Prisma Studio |

`pnpm db:reset` drops and recreates the database — don't point it at anything real.

No test framework is configured; verification is `pnpm build` + `pnpm lint`.

## Environment

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | MySQL/MariaDB connection string |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Order destination, international format, no `+` or dashes |
| `ADMIN_PASSWORD` | Shared password for the admin dashboard |
| `ADMIN_SESSION_SECRET` | Session cookie signing key, at least 32 characters |
| `BASEPATH` | Optional Next.js base path |
| `NEXT_PUBLIC_APP_URL` | Declared, currently unused |

## Layout

```
src/app/[lang]/**            storefront pages (id / en)
src/components/storefront/** storefront components
src/contexts/cartContext.tsx localStorage cart
src/dictionaries/**          bilingual UI strings
src/libs/                    prisma client + cached product queries
src/utils/                   currency, images, WhatsApp message builder
src/configs/shopConfig.ts    business details
prisma/                      schema, migrations, seed

src/app/(dashboard)/admin/** admin product CRUD + settings (the only DB write path)
src/libs/admin/**            admin auth, storage, validation, mutations
src/views/admin/**           admin forms, tables and settings panels
src/proxy.ts                 admin route gate (must stay in src/)

src/@core, @layouts, @menu   Vuexy admin template (vendor code — don't edit)
src/app/(dashboard)/home     remaining template stub
```

The repo holds two apps in one tree: the storefront, and the Vuexy MUI admin template it was
scaffolded from — most of which is untouched and unused.

## Documentation

Detailed reference docs live in [`ref/`](ref/README.md): architecture, data model,
storefront, i18n, styling, admin template, and conventions. [`CLAUDE.md`](CLAUDE.md) is the
short orientation for AI coding agents.

## Admin

Sign in at `/login` with `ADMIN_PASSWORD`.

- **`/admin/products`** — add, edit and delete products with their variants, tasting
  notes, varietals and photo.
- **`/admin/settings`** — *Perusahaan* (placeholder; company details still live in
  `src/configs/shopConfig.ts`) and *Referensi*, where the varietal vocabulary is managed.

See [ref/admin-dashboard.md](ref/admin-dashboard.md).

## Status

Pre-launch. Seed prices, tasting notes, producer details and product photography are
placeholders pending client confirmation. See
[ref/conventions.md](ref/conventions.md#known-open-items-before-launch).

## License

Private. Built on the Vuexy MUI Next.js admin template under its commercial license.
