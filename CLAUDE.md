# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## What this is

**Kopi Teduh Roastery** — a bilingual (Indonesian / English) storefront for a coffee
roastery in Poso, Sulawesi Tengah. It is a catalog plus a cart that hands off to WhatsApp:
there is deliberately **no checkout, no payment, and no `Order` table**. The cart lives in
`localStorage`, and the WhatsApp message is the order record.

Stack: Next.js 16 (App Router) · React 19 · Prisma 7 + MariaDB · MUI 7 · Tailwind v4 · pnpm.

The project was scaffolded from the **Vuexy MUI admin template**, most of which is still
present, unmodified, and unused by the storefront. Two apps share one tree — know which one
you're editing.

## Reference docs

Detail lives in `ref/`. Read the relevant file before non-trivial work.

| File | Read it when |
| --- | --- |
| [ref/architecture.md](ref/architecture.md) | Orienting; anything touching routing, the root layout, or static rendering |
| [ref/data-model.md](ref/data-model.md) | Touching Prisma, the schema, migrations, seed, or data fetching |
| [ref/storefront.md](ref/storefront.md) | Working on pages, storefront components, the cart, or checkout |
| [ref/i18n.md](ref/i18n.md) | Adding or changing any user-facing string |
| [ref/styling.md](ref/styling.md) | Writing CSS, adding an icon, adding an image or font |
| [ref/admin-template.md](ref/admin-template.md) | Touching `@core`/`@layouts`/`@menu`, the MUI theme, or building an admin |
| [ref/conventions.md](ref/conventions.md) | Before committing; lint rules that fail the build |

## Commands

```bash
pnpm dev            # dev server with turbopack (:3000, / redirects to /id)
pnpm build          # production build
pnpm lint           # eslint — enforces more than formatting, see ref/conventions.md
pnpm format         # prettier over src/**
pnpm build:icons    # regenerate generated-icons.css (runs on postinstall)

pnpm db:generate    # prisma generate — after any schema.prisma edit
pnpm db:migrate     # prisma migrate dev
pnpm db:seed        # tsx prisma/seed.ts
pnpm db:studio      # prisma studio
```

No test framework is configured. Verification = `pnpm build` + `pnpm lint` + clicking
through routes.

**`pnpm db:reset` drops the database.** Per the global instructions, do not run it, or any
other destructive DB command, without asking.

## The things that will bite you

**Storefront static rendering is load-bearing and fragile.** Every storefront page is
prerendered at build time, including DB-backed ones. `src/app/layout.tsx` was deliberately
stripped of dynamic APIs to allow this — adding a cookie or header read there opts the whole
storefront into dynamic rendering. Per-locale `<html lang>` is set by an inline script in
`[lang]/layout.tsx` for the same reason.

**Prisma 7 is not Prisma 5.** The generator is `prisma-client` (output to
`src/generated/prisma`, gitignored) — import from `@/generated/prisma/client`, not
`@prisma/client`. The datasource block has **no `url`**; the connection string lives in
`prisma.config.ts`. A driver adapter (`@prisma/adapter-mariadb`) is **required** when
constructing the client.

**The admin theme is controlled by a cookie, not by code.** Changing `mode`, `skin`,
`semiDark`, `layout` or `contentWidth` in `src/configs/themeConfig.ts` has no visible effect
until the settings cookie is cleared. Details in
[ref/admin-template.md](ref/admin-template.md).

**Icons are CSS classes, bundled at build time.** A new icon must be added to the `icons`
array in `src/assets/iconify-icons/bundle-icons-css.ts` followed by `pnpm build:icons` — an
unbundled class silently renders nothing.

**Logical properties are enforced.** Write `is-full`, `bs-10`, `mli-`, `plb-`, never `w-`,
`h-`, `ml-`, `pt-`.

**Don't edit `src/@core`, `src/@layouts`, `src/@menu`.** Vendor template code; edits make
upgrades painful. Application code belongs in `src/app`, `src/components`, `src/views`,
`src/configs`, `src/data`, `src/libs`, `src/utils`, `src/contexts`, `src/dictionaries`.

## Storefront conventions

- Route segments stay **Indonesian in both locales** (`koleksi`, `keranjang`, `kopi`,
  `tentang`). English gets translated content, not translated URLs.
- Server components fetch and translate; client components receive `dict` and `lang` as
  props. There is no translation hook or context.
- UI strings live in `src/dictionaries/id.ts` (source of truth) and `en.ts` (typed against
  it — a missing key is a compile error). Long-form page copy does **not** go there; see
  [ref/i18n.md](ref/i18n.md).
- Database display strings go through `pickLocalized(lang, base, translated)` — never read
  `nameEn` directly. Indonesian columns are required, English ones nullable.
- Prices are integer rupiah; format with `formatIdr`.
- Storefront CSS is scoped under a `.teduh` wrapper with `teduh-` prefixed classes.

## Not yet done

Seed data, product photography and some shop details are **placeholders awaiting client
confirmation**; `/login` has no authentication behind it. See the open items list in
[ref/conventions.md](ref/conventions.md#known-open-items-before-launch).
