# Architecture

## Two apps in one tree

The repository hosts two largely separate applications that share only `src/app/layout.tsx`
and the build config.

**1. The storefront** — the actual product. Public, bilingual, statically rendered.

```
src/app/[lang]/**        pages
src/components/storefront/**
src/contexts/cartContext.tsx
src/dictionaries/**
src/libs/products.ts, src/libs/prisma.ts
src/utils/format.ts, images.ts, whatsapp.ts
src/configs/shopConfig.ts
src/data/legal.ts
src/app/storefront.css
prisma/**
```

**2. The Vuexy admin template** — vendor scaffolding, mostly untouched, not yet a real admin.

```
src/@core/**   src/@layouts/**   src/@menu/**
src/app/(dashboard)/**   src/app/(blank-layout-pages)/**
src/components/layout/**, GenerateMenu.tsx, Providers.tsx, theme/**
src/views/Login.tsx, src/views/NotFound.tsx
src/configs/themeConfig.ts, primaryColorConfig.ts
src/data/navigation/**   src/types/menuTypes.ts
src/app/globals.css
```

They are kept stylistically isolated: storefront CSS is scoped under a `.teduh` wrapper
class so it cannot collide with MUI's tokens. See [styling.md](styling.md).

## Directory boundary — respect it

`src/@core`, `src/@layouts`, `src/@menu` are **vendor template code**. Editing them makes
template upgrades painful. Application code belongs in `src/app`, `src/components`,
`src/views`, `src/configs`, `src/data`, `src/libs`, `src/utils`, `src/contexts`,
`src/dictionaries`.

Path aliases (`tsconfig.json`): `@/*`, `@core/*`, `@layouts/*`, `@menu/*`, `@assets/*`,
`@components/*`, `@configs/*`, `@views/*`.

## Route map

### Storefront — `src/app/[lang]/`

| Route | File | Notes |
| --- | --- | --- |
| `/[lang]` | `layout.tsx` | Fonts, `.teduh` wrapper, `CartProvider`, header/footer. `notFound()` on an unknown locale. `generateStaticParams` over `LANGS`. |
| `/[lang]` | `page.tsx` | Home — hero, featured lots (`getFeaturedProducts()`), dark story band |
| `/[lang]/koleksi` | `koleksi/page.tsx` | Collection, grouped into Arabica / Robusta sections. No filter UI by design. |
| `/[lang]/kopi/[slug]` | `kopi/[slug]/page.tsx` | Product detail. `generateStaticParams` over locale × product. |
| `/[lang]/keranjang` | `keranjang/page.tsx` | Cart page, wraps `<CartView>` |
| `/[lang]/kontak` | `kontak/page.tsx` | Contact details + WhatsApp CTA. No contact form by design. |
| `/[lang]/tentang` | `tentang/page.tsx` | About — philosophy copy, stats band, team |
| `/[lang]/panduan-berbelanja` | | `<LegalArticle docKey='guide'>` |
| `/[lang]/kebijakan-privasi` | | `<LegalArticle docKey='privacy'>` |
| `/[lang]/syarat-ketentuan` | | `<LegalArticle docKey='terms'>` |

`src/app/[...not-found]/page.tsx` calls `notFound()` so unknown paths return a real 404
status rather than a soft 200. `src/app/not-found.tsx` renders a storefront-styled
bilingual 404 — it re-imports the fonts and `storefront.css` itself so it stays static.

### Admin template

| Route | File |
| --- | --- |
| `/home` | `src/app/(dashboard)/home/page.tsx` |
| `/about` | `src/app/(dashboard)/about/page.tsx` |
| `/login` | `src/app/(blank-layout-pages)/login/page.tsx` |

`(dashboard)` pages get the full MUI shell (navigation, navbar, footer, customizer);
`(blank-layout-pages)` are chrome-less.

## Rendering strategy

Everything in the storefront is **statically prerendered at build time**, including pages
that read the database. This is deliberate and slightly fragile:

- `src/app/layout.tsx` was stripped of dynamic APIs (cookie reads etc.) specifically so the
  storefront subtree can stay static. Reintroducing a dynamic API there would opt every
  storefront page into dynamic rendering.
- Per-locale `<html lang>` is set by an inline script in `[lang]/layout.tsx` rather than on
  the root `<html>`, for the same reason.
- DB reads go through `unstable_cache` tagged `'products'` (`PRODUCTS_TAG`), so a future
  admin write path can call `revalidateTag('products')` for on-demand ISR instead of a
  rebuild. See [data-model.md](data-model.md).

## `next.config.ts`

- `basePath: process.env.BASEPATH`
- `redirects()`: `/` → `/id`, **`permanent: false`** — intentionally a 307, not a 308, so a
  future locale-negotiation middleware isn't fighting a cached permanent redirect.
- `images.remotePatterns`: only `placehold.co` and `images.unsplash.com`, explicitly
  whitelisted (placeholder art — see [styling.md](styling.md)).
- No `i18n` block: locale routing is manual via the `[lang]` segment.
