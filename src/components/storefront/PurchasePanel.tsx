'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// Type Imports
import type { Lang, Dictionary } from '@/dictionaries'
import type { ProductWithRelations, GrindOptionRecord } from '@/libs/products'

// Dictionary Imports
import { pickLocalized } from '@/dictionaries'

// Context Imports
import { useCart } from '@/contexts/cartContext'

// Util Imports
import { formatIdr, formatWeight } from '@/utils/format'
import { productImage } from '@/utils/images'

type Props = {
  product: ProductWithRelations
  grinds: GrindOptionRecord[]
  lang: Lang
  dict: Dictionary
}

const PurchasePanel = ({ product, grinds, lang, dict }: Props) => {
  const router = useRouter()
  const { add } = useCart()

  const [variantId, setVariantId] = useState(
    () => (product.variants.find(v => v.isDefault) ?? product.variants[0])?.id
  )

  const [grindSlug, setGrindSlug] = useState(() => (grinds.find(g => g.isDefault) ?? grinds[0])?.slug)
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  const variant = product.variants.find(v => v.id === variantId)
  const grind = grinds.find(g => g.slug === grindSlug)

  const name = pickLocalized(lang, product.name, product.nameEn)

  const handleAdd = () => {
    if (!variant || !grind) return

    add(
      {
        productSlug: product.slug,
        productName: name,
        variantId: variant.id,
        weightG: variant.weightG,
        grindSlug: grind.slug,
        grindName: pickLocalized(lang, grind.name, grind.nameEn),
        unitPriceIdr: variant.priceIdr,
        image: productImage({ heroImage: product.heroImage, name, species: product.species })
      },
      qty
    )

    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1800)

    // Refresh so the header badge updates immediately on slower devices.
    router.refresh()
  }

  const swatchStyle = (selected: boolean) => ({
    fontSize: 'var(--teduh-small)',
    color: selected ? 'var(--teduh-paper)' : 'var(--teduh-ink)',
    backgroundColor: selected ? 'var(--teduh-ink)' : 'transparent',
    borderColor: selected ? 'var(--teduh-ink)' : 'var(--teduh-line)'
  })

  return (
    <div>
      {/* Price reflects the selected variant, so it has to live in the client
          component rather than being rendered once on the server. */}
      <p style={{ fontSize: 'var(--teduh-h3)', fontWeight: 600, color: 'var(--teduh-ochre)' }}>
        {variant ? formatIdr(variant.priceIdr) : '—'}
      </p>

      {/* Weight */}
      <fieldset className='mbs-8 border-0 p-0 m-0'>
        <legend className='teduh-eyebrow p-0'>{dict.product.weight}</legend>
        <div className='mbs-3 flex flex-wrap gap-2'>
          {product.variants.map(v => (
            <button
              key={v.id}
              type='button'
              onClick={() => setVariantId(v.id)}
              aria-pressed={v.id === variantId}
              className='teduh-tap border pli-4 transition-colors duration-200'
              style={swatchStyle(v.id === variantId)}
            >
              {formatWeight(v.weightG)}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Grind */}
      <fieldset className='mbs-7 border-0 p-0 m-0'>
        <legend className='teduh-eyebrow p-0'>{dict.product.grind}</legend>
        <div className='mbs-3 flex flex-wrap gap-2'>
          {grinds.map(g => (
            <button
              key={g.slug}
              type='button'
              onClick={() => setGrindSlug(g.slug)}
              aria-pressed={g.slug === grindSlug}
              className='teduh-tap border pli-4 transition-colors duration-200'
              style={swatchStyle(g.slug === grindSlug)}
            >
              {pickLocalized(lang, g.name, g.nameEn)}
            </button>
          ))}
        </div>
        {grind?.note && (
          <p className='mbs-2' style={{ fontSize: 'var(--teduh-micro)', color: 'var(--teduh-ink-soft)' }}>
            {pickLocalized(lang, grind.note, grind.noteEn)}
          </p>
        )}
      </fieldset>

      {/* Quantity + add */}
      <div className='mbs-8 flex items-stretch gap-3'>
        <div
          className='flex items-center border teduh-btn'
          style={{ borderColor: 'var(--teduh-line)' }}
          role='group'
          aria-label={dict.product.qty}
        >
          <button
            type='button'
            className='teduh-tap flex items-center justify-center'
            onClick={() => setQty(q => Math.max(1, q - 1))}
            aria-label='−'
            disabled={qty <= 1}
            style={{ opacity: qty <= 1 ? 0.35 : 1 }}
          >
            −
          </button>
          <span className='min-is-[2.5rem] text-center' aria-live='polite' style={{ fontWeight: 600 }}>
            {qty}
          </span>
          <button
            type='button'
            className='teduh-tap flex items-center justify-center'
            onClick={() => setQty(q => Math.min(99, q + 1))}
            aria-label='+'
          >
            +
          </button>
        </div>

        <button
          type='button'
          onClick={handleAdd}
          disabled={!variant || !grind}
          className='teduh-tap flex-auto flex items-center justify-center transition-colors duration-200'
          style={{
            fontSize: 'var(--teduh-small)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--teduh-paper)',
            backgroundColor: justAdded ? 'var(--teduh-moss)' : 'var(--teduh-ochre)'
          }}
        >
          {justAdded ? dict.product.added : dict.product.addToCart}
        </button>
      </div>

      {/* Announced to screen readers without stealing focus */}
      <p className='sr-only' role='status' aria-live='polite'>
        {justAdded ? `${name} — ${dict.product.added}` : ''}
      </p>
    </div>
  )
}

export default PurchasePanel
