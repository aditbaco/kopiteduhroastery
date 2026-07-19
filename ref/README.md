# Reference Documentation

Deep-dive docs for the Kopi Teduh Roastery codebase. `CLAUDE.md` at the repo root is the
short orientation; these files are the detail behind it.

| File | Covers |
| --- | --- |
| [architecture.md](architecture.md) | The two-apps-in-one-tree layout, directory boundaries, full route map, rendering strategy |
| [data-model.md](data-model.md) | Prisma schema, migrations, seed data, the caching data-access layer, env vars, DB workflow |
| [storefront.md](storefront.md) | Storefront pages, components, cart context, the WhatsApp checkout handoff |
| [i18n.md](i18n.md) | The hand-rolled `[lang]` bilingual system, dictionary typing, DB-content fallback |
| [styling.md](styling.md) | `storefront.css` design tokens vs. the Tailwind/MUI bridge, fonts, icons, images |
| [admin-template.md](admin-template.md) | The Vuexy template layer, the theme-settings cookie, navigation data |
| [conventions.md](conventions.md) | Commands, code style, the lint rules that actually fail builds |

## Quick orientation

Kopi Teduh Roastery is a **bilingual (id/en) coffee storefront** for a roastery in Poso,
Sulawesi Tengah. It is a catalog + cart that hands off to WhatsApp — there is deliberately
**no checkout, no payment, and no `Order` table**. The cart lives in `localStorage`; the
WhatsApp message *is* the order record.

It is built on top of the **Vuexy MUI Next.js admin template**, most of which is still
unmodified and unused by the storefront. See [architecture.md](architecture.md) for which
directories belong to which app.

Stack: Next.js 16 (App Router) · React 19 · Prisma 7 + MariaDB · MUI 7 (admin only) ·
Tailwind v4 · pnpm.
