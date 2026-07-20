# Commands and Conventions

## Setup

```bash
pnpm install                 # runs build:icons on postinstall
cp .env.example .env         # then fill DATABASE_URL
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Package manager is **pnpm** — `.npmrc` sets `shamefully-hoist` and `node-linker=hoisted`,
so npm or yarn will produce a differently-shaped `node_modules`.

## Commands

| Command | Does |
| --- | --- |
| `pnpm dev` | Dev server with turbopack on :3000; `/` → `/id` |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` / `lint:fix` | ESLint over `.js,.jsx,.ts,.tsx` |
| `pnpm format` | Prettier over `src/**` |
| `pnpm build:icons` | Regenerate `src/assets/iconify-icons/generated-icons.css` |
| `pnpm clean` / `clear` | Remove `.next` / `node_modules` + `.next` |
| `pnpm db:generate` | `prisma generate` |
| `pnpm db:migrate` | `prisma migrate dev` |
| `pnpm db:seed` | `tsx prisma/seed.ts` |
| `pnpm db:studio` | Prisma Studio |
| `pnpm db:reset` | `prisma migrate reset` — **drops the database** |

`clean` and `clear` use `rm -rf`, so they need a POSIX shell (Git Bash) on Windows.

**There is no test framework configured.** Verification means `pnpm build` plus
`pnpm lint`, and clicking through the routes.

## Formatting — Prettier

No semicolons · single quotes, JSX included · no trailing commas · 120 columns · arrow
parens avoided.

## Lint rules that actually fail the build

Beyond formatting, these will fail `pnpm lint`:

- **`@typescript-eslint/consistent-type-imports`** — type-only imports must use
  `import type`.
- **`import/order`** — grouped, blank-line-separated import blocks. The codebase convention
  is a comment above each group:

  ```ts
  // React Imports
  // Next Imports
  // MUI Imports
  // Third-party Imports
  // Type Imports
  // Component Imports
  // Util Imports
  ```

- **`newline-before-return`**, **`lines-around-comment`**, and
  **`padding-line-between-statements`** — blank line after `const`/`let`/`var` groups, and
  around functions and multiline blocks.

Stylelint enforces **`liberty/use-logical-spec`**: write logical properties (`is-full`,
`bs-10`, `mli-`, `plb-`), never `w-`/`h-`/`ml-`/`pt-`. See
[styling.md](styling.md#logical-properties-are-enforced).

## Conventions worth matching

- **Route segments are Indonesian** (`koleksi`, `keranjang`, `kopi`, `tentang`,
  `kebijakan-privasi`) in both locales. English gets translated *content*, not translated
  URLs.
- **Storefront CSS classes are prefixed `teduh-`** and only work inside the `.teduh`
  wrapper.
- **Server components fetch and translate; client components receive `dict` and `lang` as
  props.** No translation hook exists.
- **Prices are integer rupiah** everywhere; format with `formatIdr`, never manually.
- **Database display strings go through `pickLocalized`**, never read `nameEn` directly.

## Committing

Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, …), lowercase, imperative,
no trailing period, first line ≤72 characters.

## Known open items before launch

- Seed data is **placeholder** — prices, tasting notes, producer names, partnership years,
  process and roast levels all need client confirmation
  ([data-model.md](data-model.md#migrations-and-seed)).
- Product photography is placeholder/stock; `placehold.co` and Unsplash should drop out of
  `images.remotePatterns` once real assets land ([styling.md](styling.md#images)).
- `shopConfig.ts` carries a contradiction in opening hours (23:30 vs 21:30).
- The admin login has **no rate limiting**, and its single shared password means no audit
  trail of who changed what ([admin-dashboard.md](admin-dashboard.md#known-gaps)).
- `UserDropdown` still shows the template's placeholder identity and dead menu links.
