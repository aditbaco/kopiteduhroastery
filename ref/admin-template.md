# Admin Template Layer

The project was scaffolded from the **Vuexy MUI Next.js admin template** (commercial
license — `package.json` still carries the template's provenance). Most of it is untouched
and unused by the storefront. This file exists so you can tell template code from product
code, and so the non-obvious theme-cookie behaviour doesn't cost you an afternoon.

## What belongs to the template

```
src/@core/**       MUI theme (per-component overrides), settings context,
                   shared UI primitives, server helpers
src/@layouts/**    VerticalLayout / HorizontalLayout / LayoutWrapper shells
src/@menu/**       navigation menu engine (vertical + horizontal), contexts, CSS modules
src/components/layout/**, GenerateMenu.tsx, Providers.tsx, theme/**
src/views/Login.tsx, src/views/NotFound.tsx
src/configs/themeConfig.ts, primaryColorConfig.ts
src/data/navigation/**, src/types/menuTypes.ts
src/app/(dashboard)/**, src/app/(blank-layout-pages)/**
src/app/globals.css
src/assets/iconify-icons/**
public/images/illustrations/**, avatars/**
```

`src/@core`, `src/@layouts` and `src/@menu` are **vendor code — don't edit them.** Changes
there make template upgrades painful.

## Current state

Three pages survive: `/home`, `/about` (both under the `(dashboard)` group with the full
MUI shell) and `/login` (chrome-less, under `(blank-layout-pages)`). Login is a **view
only** — there is no authentication, no session, and no admin write path to the database.

An admin dashboard has been discussed but not built. If one is added, note that
`src/libs/products.ts` already tags its cache `PRODUCTS_TAG` so writes can call
`revalidateTag('products')` rather than triggering a rebuild.

## The theme settings cookie — the non-obvious part

Theme state lives in a **cookie**, not in code. `themeConfig.settingsCookieName` names it;
`src/@core/utils/serverHelpers.ts` (`server-only`) reads it in server components.

Flow:

```
app/layout.tsx           reads getSystemMode() for InitColorSchemeScript
  └─ (dashboard)/layout.tsx + components/Providers.tsx
       read mode/settings from the cookie
       └─ VerticalNavProvider → SettingsProvider
            └─ components/theme/index.tsx
                 deepmerge(@core theme, runtime primaryColor)
                 re-created whenever primaryColor / skin / mode change
```

**Consequence:** changing `mode`, `skin`, `semiDark`, `layout`, or the `contentWidth` fields
in `src/configs/themeConfig.ts` has **no visible effect** until the settings cookie is
cleared or reset via the Customizer — the cookie wins. Other fields in that file apply
immediately.

To customize the theme, write overrides in `src/components/theme/mergedTheme.ts` (which
merges over the core theme) rather than editing `@core/theme` or using `userTheme.ts` (a
from-scratch replacement the template discourages).

## Navigation

Menus are data, not JSX. Edit `src/data/navigation/verticalMenuData.tsx` and
`horizontalMenuData.tsx` — **keep both in sync**. `src/components/GenerateMenu.tsx` walks
that data and renders sections, submenus and items; `prefix` / `suffix` entries shaped like
`ChipProps` (i.e. having a `label`) are auto-rendered as a `CustomChip`.

None of this drives the storefront header, which is a plain component with a hardcoded nav
list.

## Interaction with the storefront

The two apps share exactly one file: `src/app/layout.tsx`. It has been **stripped of dynamic
APIs** so the storefront subtree can be statically prerendered. If admin work needs cookie
or header reads at the root, they must be pushed down into `(dashboard)/layout.tsx` instead
— putting them back in the root layout would opt every storefront page into dynamic
rendering. See [architecture.md](architecture.md#rendering-strategy).
