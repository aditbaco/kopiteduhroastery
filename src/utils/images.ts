/*
 * Image sources are all placeholder until the client supplies real photography.
 *
 * - Product shots: placehold.co, tinted to the Teduh palette so the grid still
 *   reads as designed rather than as grey boxes.
 * - Atmosphere/decor: Unsplash, hotlinked with fixed IDs so the same photo is
 *   served every time (a random endpoint would reshuffle on every request and
 *   defeat next/image caching).
 *
 * REPLACE BEFORE LAUNCH: swap product placeholders for real bag photography and
 * download the Unsplash shots locally, or license them properly.
 */

// Palette hex without the leading # — placehold.co wants it bare.
const BG = 'EBE3D6'
const FG = '5C463A'

// Square by default — product frames are 1:1 everywhere (catalog card, detail
// hero, cart, admin), so a portrait placeholder would be cropped on both edges.
export const placeholderProduct = (label: string, w = 1000, h = 1000) =>
  `https://placehold.co/${w}x${h}/${BG}/${FG}/png?text=${encodeURIComponent(label)}&font=playfair-display`

// Curated Unsplash photo IDs — coffee cherries, highland terrain, roasting,
// brewing. Chosen to sit with a warm earth palette rather than the cold blue
// that dominates stock coffee photography.
export const DECOR = {
  hero: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600&q=70&auto=format&fit=crop',
  cherries: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=1200&q=70&auto=format&fit=crop',
  highland: 'https://images.unsplash.com/photo-1523920290228-4f321a939b4c?w=1600&q=70&auto=format&fit=crop',
  roasting: 'https://images.unsplash.com/photo-1580933073521-dc49ac0d4e6a?w=1200&q=70&auto=format&fit=crop',
  brewing: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=70&auto=format&fit=crop',
  beans: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&q=70&auto=format&fit=crop'
} as const

/*
 * Species artwork from the original WordPress site — a bowl of beans labelled
 * "Arabica" / "Robusta" by hand. These are transparent square PNGs of a round
 * bowl, so they must be rendered object-contain on the warm card background;
 * object-cover crops the bowl.
 *
 * They are per-species, not per-product, so every arabica lot currently shares
 * one image. Real per-lot photography should replace them via Product.heroImage,
 * which takes precedence below.
 */
export const SPECIES_IMAGE = {
  ARABICA: '/images/species/arabica.png',
  ROBUSTA: '/images/species/robusta.png'
} as const

export type SpeciesKey = keyof typeof SPECIES_IMAGE

// heroImage wins when set; otherwise fall back to the species artwork, and only
// to a tinted placeholder if the species is somehow unknown.
export const productImage = (product: { heroImage?: string | null; name: string; species?: SpeciesKey }) =>
  product.heroImage || (product.species ? SPECIES_IMAGE[product.species] : placeholderProduct(product.name))

// Species art is line-art on transparency and must not be cropped; real
// photography should fill the frame. Callers use this to pick the fit.
export const isSpeciesArt = (src: string) => src.startsWith('/images/species/')

/*
 * Empty-cart illustration, supplied by the client. Shared by the cart page and
 * the header's hover preview so the two states cannot drift apart.
 *
 * Intrinsic size is 482×249 — pass those to next/image as width/height, and a
 * `sizes` matching the rendered width, or Next requests a far larger candidate
 * than the slot needs.
 */
export const EMPTY_CART_ART = '/images/pages/empty-cart.png'
