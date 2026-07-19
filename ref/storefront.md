# Storefront

The public site: a bilingual coffee catalog whose checkout is a WhatsApp handoff.

## Pages

All live under `src/app/[lang]/`. See the route table in
[architecture.md](architecture.md#route-map). Each page is a server component that
`await getDictionary(lang)`, fetches through `src/libs/products.ts`, and passes `dict` and
`lang` down as props — including into client components. There is no translation hook or
context.

Two absences are deliberate, not oversights:

- **The collection page has no filter or sort UI.** Five lots don't warrant it; products are
  simply grouped into Arabica and Robusta sections.
- **The contact page has no form.** Every contact route is a direct channel — WhatsApp,
  phone, email, maps — because there is no backend to receive a form submission.

Long-form page copy is **not** in the dictionaries. Legal and info page bodies live in
`src/data/legal.ts` (`LEGAL_DOCS` keyed `guide` / `privacy` / `terms`, each a
`Record<Lang, LegalDoc>`, plus `LEGAL_UPDATED` and `LEGAL_SLUG`). The About page's
philosophy copy and team list are local constants in its own file.

## Components — `src/components/storefront/`

| File | Purpose | |
| --- | --- | --- |
| `Header.tsx` | Sticky header: logo, desktop nav, language toggle, `CartMenu`. Mobile burger + animated drawer with a WhatsApp CTA. Transparent until scrolled; closes on Escape and route change; locks body scroll while open. | client |
| `CartMenu.tsx` | Cart icon with a count badge, wrapping a real `<Link>`. Desktop-only hover preview: up to 3 lines, overflow count, subtotal, empty-state artwork. | client |
| `CartView.tsx` | The cart page body — line list with quantity steppers and remove, sticky summary, note textarea, WhatsApp checkout link. Handles loading and empty states. | client |
| `PurchasePanel.tsx` | Product buy box — weight swatches, grind swatches with notes, quantity stepper, add-to-cart with "Added" feedback. | client |
| `ProductCard.tsx` | Grid card: image, species eyebrow, name, altitude, short description, cheapest variant price. | server |
| `Footer.tsx` | Dark four-column footer: lockup, address and hours from `SHOP`, contact and social links, legal links. | server |
| `LegalArticle.tsx` | Shared 68ch single-column layout for the three info pages; renders `body` / `steps` / `points` sections plus sibling links. | server |
| `SocialIcon.tsx` | Inlined Simple Icons (CC0) glyphs for instagram / facebook / x / youtube, 24×24, `currentColor`. | server |

Note `src/views/` holds **no** storefront views — only the template's `Login.tsx` and
`NotFound.tsx`.

## Cart — `src/contexts/cartContext.tsx`

Client-only, persisted to `localStorage` under `teduh-cart-v1`. No server cart, no DB.

A line's identity is `` `${variantId}:${grindSlug}` `` — the same coffee at the same weight
but a different grind is a **separate line**, because it's a physically different product
off the grinder.

```ts
const { items, count, total, hydrated, add, setQty, remove, clear } = useCart()
```

- `add(item, qty = 1)` merges into an existing line by key.
- `setQty(key, n)` with `n <= 0` removes the line.
- `count` and `total` are memoized derivations.
- `hydrated` gates rendering. One effect reads `localStorage` in a try/catch (corrupt data
  or private-mode storage → start empty) and flips the flag; a second writes on every
  change once hydrated. Consumers must check `hydrated` or the badge and cart flash empty
  on first paint.
- `useCart()` throws outside a `CartProvider`.

## WhatsApp checkout

Checkout is a **handoff, not a transaction**. Nothing is persisted server-side; the WhatsApp
message *is* the order record, and shipping and payment are negotiated in the chat.

1. **Add** — `PurchasePanel` defaults to the `isDefault` variant and grind, resolves display
   names through `pickLocalized` and the image through `productImage`, then calls `add(...)`
   and `router.refresh()`.
2. **Persist** — `cartContext` merges by line key and writes to `localStorage`.
3. **Review** — `/[lang]/keranjang` renders `CartView`: lines, steppers, remove, total, and
   a free-text note field held in local state.
4. **Compose** — `CartView` calls `buildWhatsAppUrl({ lang, note, lines })` from
   `src/utils/whatsapp.ts`. `buildOrderMessage` emits a greeting, numbered lines
   (`name — weight — grind — xqty — line total`), a total, the optional note, and a closing
   asking about shipping and payment. The URL is
   `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(msg)}` — `wa.me`, not the older
   `api.whatsapp.com/send`, and the number comes from `SHOP` so a missing env var can't
   produce `wa.me/undefined`.
5. **Send** — an `<a target='_blank' rel='noopener noreferrer'>`, so the cart survives in the
   original tab.

**The cart is never cleared automatically.** `clear()` exists in the context but has no
caller — the customer may need to re-send or amend the message.

Secondary entry points use `buildGreetingUrl(lang)` (greeting + "Saya mau bertanya."): the
footer contact list, the mobile drawer CTA, and the contact page aside. The greeting names
the website as the source, so whoever answers the shared phone knows where the enquiry came
from.

## Utilities — `src/utils/`

- **`format.ts`** — `formatIdr` (Intl `id-ID`, 0 fraction digits → `Rp 95.000`),
  `formatNumber`, `formatWeight` (≥1000 → `1 kg`), `formatAltitude(min, max, lang)`
  (`1.100–1.200 mdpl` / `1,100–1,200 masl`).
- **`images.ts`** — see [styling.md](styling.md#images).
- **`whatsapp.ts`** — `buildOrderMessage`, `buildWhatsAppUrl`, `buildGreetingUrl`,
  `cartTotal`.
- **`string.ts`**, **`getInitials.ts`** — template utilities, admin side only.

## Shop details — `src/configs/shopConfig.ts`

The `SHOP` const holds name, WhatsApp number, display phone, email, address, bilingual
opening hours, maps link, and a `social[]` array whose order is render order and whose `key`
selects the glyph in `SocialIcon`.

> Open question flagged in the file: the old site gives contradictory closing times (23:30
> vs 21:30). Needs client confirmation.
