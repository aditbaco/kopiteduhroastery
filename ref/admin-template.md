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

`/home` is still a one-line template stub under the `(dashboard)` group. `/about` was
another; it was deleted when `/admin/settings` took its place in the nav.

`/login` and the `(dashboard)` shell are now **real**: there is a working
password-based session, a route gate in `src/proxy.ts`, a product CRUD editor at
`/admin/products`, and a settings page at `/admin/settings`. See
[admin-dashboard.md](admin-dashboard.md) — that is the file to read before touching admin
code. The rest of this page covers the template mechanics underneath it.

The template's own branding is gone from the shell: `components/layout/shared/Logo.tsx`
renders the Kopi Teduh lockup (icon-only on the collapsed rail) and both `FooterContent`
files carry the storefront's copyright line instead of the Pixinvent credits.

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

This data-driven path shipped commented out in the template — the menus really rendered
hardcoded `<MenuItem>` blocks, so editing the data files did nothing. It was activated when
the admin dashboard was built, and the hardcoded blocks are gone.

None of this drives the storefront header, which is a plain component with a hardcoded nav
list.

## Interaction with the storefront

The two apps share exactly one file: `src/app/layout.tsx`. It has been **stripped of dynamic
APIs** so the storefront subtree can be statically prerendered. If admin work needs cookie
or header reads at the root, they must be pushed down into `(dashboard)/layout.tsx` instead
— putting them back in the root layout would opt every storefront page into dynamic
rendering. See [architecture.md](architecture.md#rendering-strategy).
