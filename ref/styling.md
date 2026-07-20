# Styling

Three styling systems coexist. Knowing which one owns a given file matters.

| System | Scope |
| --- | --- |
| `src/app/storefront.css` | The storefront. Everything scoped under `.teduh`. |
| `src/app/globals.css` | Tailwind v4 ↔ MUI bridge. Loaded by the root layout, admin-oriented. |
| MUI theme (`src/@core/theme`, `src/components/theme`) | Admin template only. |

## `storefront.css`

~520 lines, imported by `src/app/[lang]/layout.tsx` and `src/app/not-found.tsx`. Every rule
is scoped under a `.teduh` wrapper class so storefront styles cannot collide with MUI's.

**Palette tokens**

| Token | Value |
| --- | --- |
| `--teduh-ink` | `#2b1a12` |
| `--teduh-ink-soft` | `#5c463a` |
| `--teduh-paper` | `#f4efe6` |
| `--teduh-paper-warm` | `#ebe3d6` |
| `--teduh-ochre` | `#c9711f` |
| `--teduh-ochre-deep` | `#a45816` |
| `--teduh-moss` | `#6b7355` |
| `--teduh-line` | `#d8cdbc` |

**Type scale** — fluid `clamp()` steps: `--teduh-display`, `-h1`, `-h2`, `-h3`, `-body`,
`-small`, `-micro`.

**Radii** `--teduh-radius-sm|--teduh-radius|--teduh-radius-lg` (10 / 18 / 28px) and a
z-index scale (`--z-sticky 10`, `--z-header 20`, `--z-drawer 30`, `--z-modal 50`).

It also carries a **local reset** for lists and buttons, because `globals.css` imports
Tailwind's theme and utilities but **not** preflight.

Component classes: `.teduh-media(-lg)`, `.teduh-panel`, `.teduh-btn`, `.teduh-social`,
`.teduh-display`, `.teduh-eyebrow`, `.teduh-rule`, `.teduh-grain` (an SVG fractal-noise
paper texture), `.teduh-tap` (44px minimum touch target), `.teduh-header[data-solid]`,
`.teduh-burger`, `.teduh-scrim`, `.teduh-drawer*` (animated with
`grid-template-rows: 0fr → 1fr`), `.teduh-cart-pop` (hover panel plus an invisible hover
bridge), `.teduh-steps` (`decimal-leading-zero` counter) and `.teduh-points`.

Accessibility is built into the tokens: an ochre `:focus-visible` ring, 44px tap targets,
and a `prefers-reduced-motion` kill switch on the `.teduh-rise` keyframes.

## `globals.css`

The Tailwind v4 + MUI bridge, ~220 lines, loaded by the root layout:

- `@layer theme, base, components, utilities`
- Imports `tailwindcss/theme.css` and `utilities.css` **as `important`**; no preflight
- `@plugin 'tailwindcss-logical'`
- An `@theme` block mapping Tailwind tokens onto MUI CSS variables
  (`--color-primary: var(--primary-color)`, `--radius-md: var(--mui-shape-customBorderRadius-md)`),
  so Tailwind utilities follow the active MUI theme and color scheme

Dark mode is driven by MUI's `data` color-scheme selector, not Tailwind's `dark:`. The
storefront uses none of this except the utilities and the logical-property plugin.

## Logical properties are enforced

`tailwindcss-logical` is in use and stylelint enforces `liberty/use-logical-spec`. Write
`is-full`, `bs-10`, `mli-4`, `plb-2`, `mbs-6` — **not** `w-`, `h-`, `ml-`, `pt-`.

## Fonts

Loaded via `next/font/google` in `src/app/[lang]/layout.tsx` (and duplicated in
`not-found.tsx` so the 404 stays static):

- **Fraunces** — variable serif, `axes: ['SOFT', 'WONK']`, exposed as `--font-display`.
  Do **not** add a `weight` array alongside `axes`; that combination is a build error and
  also pins the weight axis.
- **Karla** — weights 400/500/600/700, exposed as `--font-body`.

Both use `display: swap` and are applied on the `.teduh` wrapper.

## Icons (admin template)

Icons are CSS classes (`<i className='tabler-arrow-up' />`), not components. The set is
bundled at build time by `src/assets/iconify-icons/bundle-icons-css.ts` into
`generated-icons.css` (gitignored, regenerated on `postinstall`).

**To use a new icon you must add it to the `icons` array in that script and run
`pnpm build:icons`.** An unbundled class silently renders nothing.

The storefront avoids this entirely — `SocialIcon.tsx` inlines its SVG glyphs.

## Images

`src/utils/images.ts`:

- `placeholderProduct(label, w, h)` — a palette-tinted `placehold.co` URL (`EBE3D6` on
  `5C463A`)
- `DECOR` — six fixed Unsplash URLs (hero, cherries, highland, roasting, brewing, beans)
- `SPECIES_IMAGE` — `/images/species/arabica.png` and `robusta.png`
- `productImage({ heroImage, name, species })` — `heroImage` wins, then species art, then a
  placeholder
- `isSpeciesArt(src)` — decides `object-contain` vs `object-cover`
- `EMPTY_CART_ART`

### Product images are 1:1

Every frame that renders a product photo is square, matching the marketplace
convention (Shopee/Tokopedia) and the square species fallback art:

| Frame | Where |
| --- | --- |
| Catalog card | `ProductCard.tsx` — `aspectRatio: '1 / 1'` |
| Detail hero | `app/[lang]/kopi/[slug]/page.tsx` |
| Cart line | `CartView.tsx` (84px), `CartMenu.tsx` (48px) |
| Admin preview / thumb | `HeroImageField.tsx` (132px), `ProductsTable.tsx` (36px) |

**Uploads are not resized.** The file is stored as supplied and the frames crop it
with `object-fit: cover`, so a non-square photo loses its top and bottom. The upload
hint says so. Normalising on write with `sharp` (already a Next dependency) is the
option if that becomes a problem — centre-crop or pad, both in
`libs/admin/storage/`.

Decorative photography is *not* bound by this — the homepage block is 4:3 and the
about-page portrait is 4:5.

`next.config.ts` whitelists only `placehold.co` and `images.unsplash.com` in
`images.remotePatterns`.

> **Placeholders and stock decor must be replaced with real photography before launch.** The
> file header says so; the whitelist entries can be dropped at the same time.

Logo assets live in `public/images/logo/` (`lockup-dark|white`, `icon-dark|white`,
`logo-white`).
