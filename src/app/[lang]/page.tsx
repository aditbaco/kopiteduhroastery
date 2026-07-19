// Next Imports
import Link from 'next/link'
import Image from 'next/image'

// Type Imports
import type { Lang } from '@/dictionaries'

// Dictionary Imports
import { getDictionary } from '@/dictionaries'

// Lib Imports
import { getFeaturedProducts } from '@/libs/products'

// Component Imports
import ProductCard from '@/components/storefront/ProductCard'

// Util Imports
import { DECOR } from '@/utils/images'

const HomePage = async (props: { params: Promise<{ lang: Lang }> }) => {
  const { lang } = await props.params
  const dict = await getDictionary(lang)
  const featured = await getFeaturedProducts()

  return (
    <>
      {/* Hero — the type is the design. Image sits behind at low opacity so the
          headline keeps its contrast rather than fighting the photo. */}
      <section className='relative overflow-hidden teduh-grain'>
        <div className='absolute inset-0' aria-hidden='true'>
          <Image src={DECOR.highland} alt='' fill priority sizes='100vw' className='object-cover' />
          <div
            className='absolute inset-0'
            style={{
              background:
                'linear-gradient(180deg, color-mix(in srgb, var(--teduh-paper) 78%, transparent) 0%, var(--teduh-paper) 82%)'
            }}
          />
        </div>

        <div className='relative mli-auto is-full max-is-[1200px] pli-5 plb-20 md:plb-32'>
          <p className='teduh-eyebrow teduh-rise'>Poso · Sulawesi Tengah</p>

          <h1
            className='teduh-display teduh-rise mbs-4'
            style={{ maxInlineSize: '13ch', animationDelay: '80ms' }}
          >
            {dict.home.heroTitle}
          </h1>

          <p
            className='teduh-rise mbs-6'
            style={{ maxInlineSize: '46ch', color: 'var(--teduh-ink-soft)', animationDelay: '160ms' }}
          >
            {dict.home.heroLede}
          </p>

          <div className='teduh-rise mbs-8' style={{ animationDelay: '240ms' }}>
            <Link
              href={`/${lang}/koleksi`}
              className='teduh-tap inline-flex items-center gap-3 transition-colors duration-200'
              style={{
                fontSize: 'var(--teduh-small)',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--teduh-ink)',
                borderBlockEnd: '1px solid var(--teduh-ochre)',
                paddingBlockEnd: 6
              }}
            >
              {dict.home.heroCta}
              <span aria-hidden='true'>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured lots */}
      <section className='mli-auto is-full max-is-[1200px] pli-5 plb-16 md:plb-24'>
        <div className='flex items-end justify-between gap-6 flex-wrap'>
          <div>
            <p className='teduh-eyebrow'>01</p>
            <h2 className='mbs-2' style={{ fontSize: 'var(--teduh-h2)' }}>
              {dict.home.featuredTitle}
            </h2>
          </div>
          <p style={{ maxInlineSize: '34ch', color: 'var(--teduh-ink-soft)', fontSize: 'var(--teduh-small)' }}>
            {dict.home.featuredLede}
          </p>
        </div>

        <hr className='teduh-rule mbs-8' />

        <div className='mbs-10 grid gap-x-6 gap-y-12 grid-cols-2 lg:grid-cols-3'>
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} lang={lang} dict={dict} priority={i < 2} />
          ))}
        </div>

        <div className='mbs-12'>
          <Link
            href={`/${lang}/koleksi`}
            className='teduh-tap inline-flex items-center gap-3 transition-colors duration-200'
            style={{ fontSize: 'var(--teduh-small)', color: 'var(--teduh-ochre)', fontWeight: 600 }}
          >
            {dict.home.allProducts}
            <span aria-hidden='true'>→</span>
          </Link>
        </div>
      </section>

      {/* Story band — dark ground for contrast against the paper sections */}
      <section className='relative teduh-grain' style={{ backgroundColor: 'var(--teduh-ink)' }}>
        <div className='mli-auto is-full max-is-[1200px] pli-5 plb-16 md:plb-24 grid gap-10 md:grid-cols-2 md:items-center'>
          <div style={{ color: 'var(--teduh-paper)' }}>
            <p className='teduh-eyebrow' style={{ color: 'var(--teduh-paper)', opacity: 0.55 }}>
              02
            </p>
            <h2 className='mbs-2' style={{ fontSize: 'var(--teduh-h2)' }}>
              {dict.home.storyTitle}
            </h2>
            <p className='mbs-5' style={{ opacity: 0.78, maxInlineSize: '44ch' }}>
              {lang === 'id'
                ? 'Kami menyangrai hanya kopi dari Kabupaten Poso dan Tojo Una-Una. Setiap lot ditelusuri sampai desanya — Lore Betue, Lore Wuasa, Lembah Besoa, Tombiano. Tidak ada campuran dari luar Sulawesi Tengah.'
                : 'We roast coffee from the Poso and Tojo Una-Una regencies only. Every lot is traced back to its village — Lore Betue, Lore Wuasa, the Besoa valley, Tombiano. Nothing is blended in from outside Central Sulawesi.'}
            </p>
          </div>

          <div className='relative teduh-media-lg' style={{ aspectRatio: '4 / 3' }}>
            <Image
              src={DECOR.cherries}
              alt=''
              fill
              sizes='(max-width: 768px) 100vw, 520px'
              className='object-cover'
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
