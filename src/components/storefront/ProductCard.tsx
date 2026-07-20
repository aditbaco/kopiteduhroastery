// Next Imports
import Link from 'next/link'
import Image from 'next/image'

// Type Imports
import type { Lang, Dictionary } from '@/dictionaries'
import type { ProductWithRelations } from '@/libs/products'

// Dictionary Imports
import { pickLocalized } from '@/dictionaries'

// Util Imports
import { formatIdr, formatAltitude } from '@/utils/format'
import { productImage, isSpeciesArt } from '@/utils/images'

type Props = {
  product: ProductWithRelations
  lang: Lang
  dict: Dictionary
  priority?: boolean
}

const ProductCard = ({ product, lang, dict, priority = false }: Props) => {
  const name = pickLocalized(lang, product.name, product.nameEn)
  const shortDesc = pickLocalized(lang, product.shortDesc ?? '', product.shortDescEn)

  // Cards advertise the entry price, which is the smallest bag.
  const cheapest = product.variants.reduce(
    (min, v) => (v.priceIdr < min.priceIdr ? v : min),
    product.variants[0]
  )

  const src = productImage({ heroImage: product.heroImage, name, species: product.species })
  const speciesArt = isSpeciesArt(src)

  return (
    <Link
      href={`/${lang}/kopi/${product.slug}`}
      className='group flex flex-col'
      style={{ color: 'inherit', textDecoration: 'none' }}
    >
      {/* 1:1 — the marketplace convention, and the species fallback art is
          already a square PNG, so it sits in the frame without cropping. */}
      <div className='relative teduh-media' style={{ aspectRatio: '1 / 1', backgroundColor: 'var(--teduh-paper-warm)' }}>
        <Image
          src={src}
          alt={name}
          fill
          sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 380px'
          priority={priority}
          className={`transition-transform duration-500 group-hover:scale-[1.03] ${
            speciesArt ? 'object-contain p-6' : 'object-cover'
          }`}
        />
      </div>

      <p className='teduh-eyebrow mbs-4'>{dict.species[product.species]}</p>

      <h3 className='mbs-1' style={{ fontSize: 'var(--teduh-h3)' }}>
        {name}
      </h3>

      <p className='mbs-1' style={{ fontSize: 'var(--teduh-small)', color: 'var(--teduh-ink-soft)' }}>
        {formatAltitude(product.altitudeMin, product.altitudeMax, lang)}
      </p>

      {shortDesc && (
        <p
          className='mbs-2'
          style={{ fontSize: 'var(--teduh-small)', color: 'var(--teduh-ink-soft)', maxInlineSize: '34ch' }}
        >
          {shortDesc}
        </p>
      )}

      <p
        className='mbs-3 transition-colors duration-200 group-hover:text-[var(--teduh-ochre-deep)]'
        style={{ fontSize: 'var(--teduh-body)', fontWeight: 600, color: 'var(--teduh-ochre)' }}
      >
        {cheapest ? formatIdr(cheapest.priceIdr) : ''}
      </p>
    </Link>
  )
}

export default ProductCard
