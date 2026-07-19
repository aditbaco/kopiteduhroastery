// Type Imports
import type { Lang } from '@/dictionaries'

// Dictionary Imports
import { getDictionary } from '@/dictionaries'

// Lib Imports
import { getProducts } from '@/libs/products'

// Component Imports
import ProductCard from '@/components/storefront/ProductCard'

const CollectionPage = async (props: { params: Promise<{ lang: Lang }> }) => {
  const { lang } = await props.params
  const dict = await getDictionary(lang)
  const products = await getProducts()

  const arabica = products.filter(p => p.species === 'ARABICA')
  const robusta = products.filter(p => p.species === 'ROBUSTA')

  return (
    <div className='mli-auto is-full max-is-[1200px] pli-5 plb-12 md:plb-20'>
      <header>
        <p className='teduh-eyebrow'>{dict.nav.shop}</p>
        {/* Measures widened from 16ch/52ch: the heading is now a full sentence
            rather than one word, and would otherwise wrap to five short lines. */}
        <h1 className='mbs-3' style={{ fontSize: 'var(--teduh-h2)', maxInlineSize: '22ch' }}>
          {dict.shop.title}
        </h1>
        <p className='mbs-5' style={{ color: 'var(--teduh-ink-soft)', maxInlineSize: '60ch' }}>
          {dict.shop.lede}
        </p>
      </header>

      {products.length === 0 && (
        <p className='mbs-16' style={{ color: 'var(--teduh-ink-soft)' }}>
          {dict.shop.empty}
        </p>
      )}

      {/* Grouped by species rather than filtered with controls: with five
          products, a filter UI would be more chrome than content. */}
      {[
        { key: 'ARABICA' as const, items: arabica },
        { key: 'ROBUSTA' as const, items: robusta }
      ]
        .filter(group => group.items.length > 0)
        .map(group => (
          <section key={group.key} className='mbs-16'>
            <div className='flex items-baseline gap-4'>
              <h2 style={{ fontSize: 'var(--teduh-h3)' }}>{dict.species[group.key]}</h2>
              <hr className='teduh-rule flex-auto' />
              <span className='teduh-eyebrow'>{String(group.items.length).padStart(2, '0')}</span>
            </div>

            <div className='mbs-8 grid gap-x-6 gap-y-12 grid-cols-2 lg:grid-cols-3'>
              {group.items.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  lang={lang}
                  dict={dict}
                  priority={group.key === 'ARABICA' && i < 2}
                />
              ))}
            </div>
          </section>
        ))}
    </div>
  )
}

export default CollectionPage
