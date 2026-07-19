// Next Imports
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import type { Metadata } from 'next'

// Type Imports
import type { Lang } from '@/dictionaries'

// Dictionary Imports
import { getDictionary, pickLocalized, LANGS } from '@/dictionaries'

// Lib Imports
import { getProductBySlug, getProducts, getGrindOptions } from '@/libs/products'

// Component Imports
import PurchasePanel from '@/components/storefront/PurchasePanel'

// Util Imports
import { formatAltitude } from '@/utils/format'
import { productImage, isSpeciesArt } from '@/utils/images'

// Pre-renders every product in both locales at build; on-demand revalidation
// keeps them fresh after an admin edit.
export const generateStaticParams = async () => {
  const products = await getProducts()

  return LANGS.flatMap(lang => products.map(p => ({ lang, slug: p.slug })))
}

export const generateMetadata = async (props: {
  params: Promise<{ lang: Lang; slug: string }>
}): Promise<Metadata> => {
  const { lang, slug } = await props.params
  const product = await getProductBySlug(slug)

  if (!product) return {}

  const name = pickLocalized(lang, product.name, product.nameEn)
  const desc = pickLocalized(lang, product.shortDesc ?? '', product.shortDescEn)

  return { title: `${name} — Kopi Teduh Roastery`, description: desc }
}

const ProductPage = async (props: { params: Promise<{ lang: Lang; slug: string }> }) => {
  const { lang, slug } = await props.params
  const [dict, product, grinds] = await Promise.all([getDictionary(lang), getProductBySlug(slug), getGrindOptions()])

  if (!product) notFound()

  const name = pickLocalized(lang, product.name, product.nameEn)
  const description = pickLocalized(lang, product.description, product.descriptionEn)
  const heroSrc = productImage({ heroImage: product.heroImage, name, species: product.species })

  const specs = [
    { label: dict.product.origin, value: product.origin },
    { label: dict.product.altitude, value: formatAltitude(product.altitudeMin, product.altitudeMax, lang) },
    {
      label: dict.product.varietal,
      value: product.varietals.map(v => pickLocalized(lang, v.varietal.name, v.varietal.nameEn)).join(', ')
    },
    { label: dict.product.process, value: dict.process[product.process] },
    { label: dict.product.roast, value: dict.roast[product.roastLevel] },
    { label: dict.product.producer, value: product.producer ?? '—' },
    { label: dict.product.partnerSince, value: product.partnerSince ? String(product.partnerSince) : '—' }
  ].filter(s => s.value && s.value !== '—')

  return (
    <div className='mli-auto is-full max-is-[1200px] pli-5 plb-8 md:plb-14'>
      <Link
        href={`/${lang}/koleksi`}
        className='teduh-tap inline-flex items-center gap-2'
        style={{ fontSize: 'var(--teduh-small)', color: 'var(--teduh-ink-soft)' }}
      >
        <span aria-hidden='true'>←</span>
        {dict.product.back}
      </Link>

      <div className='mbs-6 grid gap-10 md:gap-14 md:grid-cols-2'>
        {/* Image column */}
        <div>
          <div
            className='relative teduh-media-lg'
            style={{ aspectRatio: '4 / 5', backgroundColor: 'var(--teduh-paper-warm)' }}
          >
            <Image
              src={heroSrc}
              alt={name}
              fill
              priority
              sizes='(max-width: 768px) 100vw, 560px'
              className={isSpeciesArt(heroSrc) ? 'object-contain p-10' : 'object-cover'}
            />
          </div>
        </div>

        {/* Detail column */}
        <div>
          <p className='teduh-eyebrow'>{dict.species[product.species]}</p>

          <h1 className='mbs-2' style={{ fontSize: 'var(--teduh-h1)', maxInlineSize: '14ch' }}>
            {name}
          </h1>

          {product.tastingNotes.length > 0 && (
            <p className='mbs-4' style={{ color: 'var(--teduh-ink-soft)', fontSize: '1.05rem' }}>
              {product.tastingNotes.map(n => pickLocalized(lang, n.label, n.labelEn)).join(' · ')}
            </p>
          )}

          <hr className='teduh-rule mbs-7' />

          <div className='mbs-7'>
            <PurchasePanel product={product} grinds={grinds} lang={lang} dict={dict} />
          </div>

          <hr className='teduh-rule mbs-10' />

          {/* Spec table — a definition list rather than a <table>, since this is
              key/value metadata, not tabular data. */}
          <dl className='mbs-7 grid gap-x-6 gap-y-4 grid-cols-[auto_1fr]'>
            {specs.map(spec => (
              <div key={spec.label} className='contents'>
                <dt className='teduh-eyebrow' style={{ alignSelf: 'baseline' }}>
                  {spec.label}
                </dt>
                <dd style={{ fontSize: 'var(--teduh-small)', margin: 0 }}>{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Long copy sits full-width below the fold, measured for reading */}
      <section className='mbs-16 md:mbs-24'>
        <hr className='teduh-rule' />
        <div className='mbs-8' style={{ maxInlineSize: '62ch' }}>
          <p style={{ fontSize: '1.0625rem', lineHeight: 1.75 }}>{description}</p>
        </div>
      </section>
    </div>
  )
}

export default ProductPage
