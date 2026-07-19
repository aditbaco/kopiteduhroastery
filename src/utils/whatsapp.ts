// Checkout is a handoff, not a transaction: we compose a human-readable order
// as plain text and open WhatsApp with it pre-filled. Nothing is persisted, so
// this message IS the order record — it has to be legible to whoever reads it
// on the roastery's phone, and unambiguous enough to pack from.

// Type Imports
import type { Lang } from '@/dictionaries'

// Config Imports
import { SHOP } from '@/configs/shopConfig'

// Util Imports
import { formatIdr, formatWeight } from './format'

export type CartLine = {
  productName: string
  weightG: number
  grindName: string
  qty: number
  unitPriceIdr: number
}

type BuildArgs = {
  lines: CartLine[]
  lang: Lang
  note?: string
}

/*
 * Every WhatsApp entry point opens with the same line, naming the website as
 * the source. Messages arrive on a phone that also takes walk-in and Instagram
 * enquiries, so saying where the person came from is genuinely useful to
 * whoever answers — and it tells the shop the site is doing its job.
 */
export const GREETING = {
  id: 'Halo kak, saya dari website Kopi Teduh Roastery.',
  en: 'Hello, I found you through the Kopi Teduh Roastery website.'
} as const

const ENQUIRY = {
  id: 'Saya mau bertanya.',
  en: 'I have a question.'
} as const

/** Generic "get in touch" link — footer, mobile drawer, contact page. */
export const buildGreetingUrl = (lang: Lang) =>
  `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(`${GREETING[lang]} ${ENQUIRY[lang]}`)}`

const COPY = {
  id: {
    greeting: `${GREETING.id} Saya mau pesan:`,
    total: 'Total',
    note: 'Catatan',
    closing: 'Mohon info ongkir dan cara pembayarannya ya. Terima kasih!',
    qty: 'x'
  },
  en: {
    greeting: `${GREETING.en} I would like to order:`,
    total: 'Total',
    note: 'Note',
    closing: 'Could you let me know the shipping cost and how to pay? Thank you!',
    qty: 'x'
  }
} as const

export const cartTotal = (lines: CartLine[]) => lines.reduce((sum, l) => sum + l.unitPriceIdr * l.qty, 0)

/**
 * Builds the order message. Kept as its own function (rather than inlined into
 * the link) so it can be unit-tested and previewed in the cart before sending.
 */
export const buildOrderMessage = ({ lines, lang, note }: BuildArgs) => {
  const t = COPY[lang]

  const items = lines.map((l, i) => {
    const lineTotal = formatIdr(l.unitPriceIdr * l.qty)

    return `${i + 1}. ${l.productName} — ${formatWeight(l.weightG)} — ${l.grindName} — ${t.qty}${l.qty} — ${lineTotal}`
  })

  const parts = [t.greeting, '', ...items, '', `${t.total}: ${formatIdr(cartTotal(lines))}`]

  if (note?.trim()) parts.push('', `${t.note}: ${note.trim()}`)

  parts.push('', t.closing)

  return parts.join('\n')
}

/**
 * wa.me is the officially supported deep link and behaves correctly on both
 * mobile (opens the app) and desktop (opens WhatsApp Web), unlike the older
 * api.whatsapp.com/send form the WordPress site used.
 */
export const buildWhatsAppUrl = (args: BuildArgs) =>

  // Number comes from SHOP rather than process.env directly: shopConfig carries
  // a hard-coded fallback, so a missing env var can't produce wa.me/undefined.
  `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(buildOrderMessage(args))}`
