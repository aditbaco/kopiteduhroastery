# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Next.js 16 (App Router) + React 19 + MUI 7 app built on the **Vuexy MUI Next.js admin template** (commercial license, `package.json` still carries the template's name/version). The template scaffolding has been stripped down to two pages (`/home`, `/about`) plus a login view — most of the surface area is still unmodified template infrastructure.

Package manager is **pnpm** (`pnpm-lock.yaml`, `.npmrc` with `shamefully-hoist` + `node-linker=hoisted`).

## Commands

```bash
pnpm dev            # dev server with turbopack (localhost:3000, / redirects to /home)
pnpm build          # production build
pnpm start          # serve production build
pnpm lint           # eslint over .js,.jsx,.ts,.tsx
pnpm lint:fix
pnpm format         # prettier over src/**
pnpm build:icons    # regenerate src/assets/iconify-icons/generated-icons.css
pnpm clean          # rm -rf .next
```

There is no test framework configured. `build:icons` runs automatically on `postinstall`.

## Architecture

### Layered directories — respect the boundary

`src/@core`, `src/@layouts`, `src/@menu` are **vendor template code**. Editing them makes template upgrades painful. Application code belongs in `src/app`, `src/components`, `src/views`, `src/configs`, `src/data`.

- `@core` — MUI theme (`@core/theme/*` per-component overrides), settings context, shared UI primitives, server helpers.
- `@layouts` — `VerticalLayout` / `HorizontalLayout` / `LayoutWrapper` shells.
- `@menu` — the navigation menu engine (vertical + horizontal), its contexts, styles, and SCSS-ish CSS modules.
- `@views` — page-level compositions rendered by thin `app/**/page.tsx` files.

Path aliases in `tsconfig.json`: `@/*`, `@core/*`, `@layouts/*`, `@menu/*`, `@assets/*`, `@components/*`, `@configs/*`, `@views/*`.

### Route groups

- `src/app/(dashboard)/` — pages wrapped in the full layout (navigation, navbar, footer, customizer).
- `src/app/(blank-layout-pages)/` — chrome-less pages (login).
- `src/app/[...not-found]/` — catch-all 404.

`next.config.ts` permanently redirects `/` → `/home` and honors a `BASEPATH` env var (see `.env.example`).

### Theme + settings flow (the non-obvious part)

Theme state lives in a **cookie**, not in code. `themeConfig.settingsCookieName` names it; `@core/utils/serverHelpers.ts` (`server-only`) reads it in Server Components.

Flow: `app/layout.tsx` reads `getSystemMode()` for `InitColorSchemeScript` → `(dashboard)/layout.tsx` and `components/Providers.tsx` read mode/settings from cookie → `VerticalNavProvider` → `SettingsProvider` → `components/theme/index.tsx` builds the MUI theme by `deepmerge`-ing `@core/theme` with the runtime primary color and re-creating it whenever `primaryColor`/`skin`/mode change.

**Consequence:** changing `mode`, `skin`, `semiDark`, `layout`, or the `contentWidth` fields in `src/configs/themeConfig.ts` has no visible effect until the settings cookie is cleared or reset via the Customizer — the cookie wins. Other fields in that file apply immediately.

To customize the theme, write overrides in `src/components/theme/mergedTheme.ts` (merges over the core theme) rather than editing `@core/theme` or using `userTheme.ts` (a from-scratch replacement, discouraged by the template).

### Styling

Tailwind v4 (CSS-first config in `src/app/globals.css` via `@theme`) coexists with MUI. Tailwind color/radius tokens are wired to MUI CSS variables (`--color-primary: var(--primary-color)`, `--radius-md: var(--mui-shape-customBorderRadius-md)`, etc.), so Tailwind utilities automatically follow the active MUI theme and color scheme. Dark mode is driven by MUI's `data` color-scheme selector, not Tailwind's `dark:`.

`tailwindcss-logical` is in use and stylelint enforces `liberty/use-logical-spec` — write **logical properties** (`is-full`, `bs-10`, `mli-`, `plb-`) not `w-`/`h-`/`ml-`/`pt-`.

### Icons

Icons are CSS classes (`<i className='tabler-arrow-up' />`), not components. The set is bundled at build time by `src/assets/iconify-icons/bundle-icons-css.ts` into `generated-icons.css`. **To use a new icon you must add it to the `icons` array in that script and run `pnpm build:icons`** — an unbundled class silently renders nothing.

### Navigation

Menus are data, not JSX: edit `src/data/navigation/verticalMenuData.tsx` and `horizontalMenuData.tsx` (keep both in sync). `src/components/GenerateMenu.tsx` walks that data and renders sections / submenus / items; `prefix`/`suffix` entries shaped like `ChipProps` (i.e. having a `label`) are auto-rendered as a `CustomChip`.

## Code style

Prettier: no semicolons, single quotes (JSX included), no trailing commas, 120 cols, arrow parens avoided.

ESLint enforces beyond formatting — these will fail `pnpm lint`:
- `@typescript-eslint/consistent-type-imports` — type-only imports must use `import type`.
- `import/order` with grouped, blank-line-separated import blocks. The codebase convention is a `// React Imports` / `// MUI Imports` / `// Third-party Imports` / `// Type Imports` / `// Component Imports` / `// Util Imports` comment above each group — follow it.
- `newline-before-return`, `lines-around-comment`, and `padding-line-between-statements` (blank line after const/let/var groups, around functions and multiline blocks).
