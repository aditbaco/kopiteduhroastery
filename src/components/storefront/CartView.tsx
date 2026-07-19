'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import Image from 'next/image'

// Type Imports
import type { Lang, Dictionary } from '@/dictionaries'

// Context Imports
import { useCart } from '@/contexts/cartContext'

// Util Imports
import { formatIdr, formatWeight } from '@/utils/format'
import { isSpeciesArt, EMPTY_CART_ART } from '@/utils/images'
import { buildWhatsAppUrl } from '@/utils/whatsapp'

type Props = {
  lang: Lang
  dict: Dictionary
}

const CartView = ({ lang, dict }: Props) => {
  const { items, total, count, hydrated, setQty, remove } = useCart()
  const [note, setNote] = useState('')

  // Reserve the layout before hydration so the page does not jump when
  // localStorage resolves.
  if (!hydrated) {
    return (
      <div style={{ minBlockSize: '40vh' }} aria-busy='true'>
        <p style={{ color: 'var(--teduh-ink-soft)' }}>{dict.common.loading}</p>
      </div>
    )
  }

  // Centred rather than left-aligned: with the lines gone there is no column
  // for the copy to line up against, and a lone sentence hanging off the left
  // edge of an otherwise empty page reads as a rendering fault.
  if (items.length === 0) {
    return (
      <div className='plb-10 text-center'>
        <Image
          src={EMPTY_CART_ART}
          alt=''
          width={482}
          height={249}
          priority
          sizes='(max-width: 480px) 90vw, 420px'
          className='mli-auto'
          style={{ inlineSize: '100%', maxInlineSize: 420, blockSize: 'auto' }}
        />

        <p className='mbs-8' style={{ fontFamily: 'var(--font-display), serif', fontSize: 'var(--teduh-h3)' }}>
          {dict.cartMenu.emptyTitle}
        </p>

        <p className='mbs-3 mli-auto' style={{ color: 'var(--teduh-ink-soft)', maxInlineSize: '38ch' }}>
          {dict.cartMenu.emptyLede}
        </p>

        {/* pli-8: teduh-btn carries only the radius and teduh-tap only the 44px
            touch minimum, so a button that is not is-full has to state its own
            inline padding or the label runs to the edges. */}
        <Link
          href={`/${lang}/koleksi`}
          className='teduh-tap teduh-btn mbs-8 pli-8 inline-flex items-center justify-center'
          style={{
            fontSize: 'var(--teduh-small)',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--teduh-paper)',

            // Same roast brown as the footer ground, matching the checkout
            // button on the filled cart — one primary action colour sitewide.
            backgroundColor: 'var(--teduh-ink)'
          }}
        >
          {dict.cart.emptyCta}
        </Link>
      </div>
    )
  }

  const waUrl = buildWhatsAppUrl({
    lang,
    note,
    lines: items.map(i => ({
      productName: i.productName,
      weightG: i.weightG,
      grindName: i.grindName,
      qty: i.qty,
      unitPriceIdr: i.unitPriceIdr
    }))
  })

  return (
    <div className='grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16'>
      {/* Lines */}
      <div>
        <ul className='flex flex-col'>
          {items.map(item => (
            <li
              key={item.key}
              className='flex gap-4 plb-6 border-bs'
              style={{ borderColor: 'var(--teduh-line)' }}
            >
              <div
                className='relative shrink-0 teduh-media'
                style={{ inlineSize: 84, aspectRatio: '4 / 5', backgroundColor: 'var(--teduh-paper-warm)' }}
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt=''
                    fill
                    sizes='84px'
                    className={isSpeciesArt(item.image) ? 'object-contain p-2' : 'object-cover'}
                  />
                )}
              </div>

              <div className='flex-auto min-is-0'>
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <Link
                      href={`/${lang}/kopi/${item.productSlug}`}
                      style={{ fontWeight: 600, color: 'inherit' }}
                    >
                      {item.productName}
                    </Link>
                    <p className='mbs-1' style={{ fontSize: 'var(--teduh-small)', color: 'var(--teduh-ink-soft)' }}>
                      {formatWeight(item.weightG)} · {item.grindName}
                    </p>
                  </div>

                  <p style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {formatIdr(item.unitPriceIdr * item.qty)}
                  </p>
                </div>

                <div className='mbs-3 flex items-center gap-4'>
                  <div
                    className='flex items-center border teduh-btn'
                    style={{ borderColor: 'var(--teduh-line)' }}
                    role='group'
                    aria-label={`${dict.product.qty}: ${item.productName}`}
                  >
                    <button
                      type='button'
                      className='teduh-tap flex items-center justify-center'
                      onClick={() => setQty(item.key, item.qty - 1)}
                      aria-label='−'
                    >
                      −
                    </button>
                    <span className='min-is-[2rem] text-center' style={{ fontWeight: 600 }}>
                      {item.qty}
                    </span>
                    <button
                      type='button'
                      className='teduh-tap flex items-center justify-center'
                      onClick={() => setQty(item.key, Math.min(99, item.qty + 1))}
                      aria-label='+'
                    >
                      +
                    </button>
                  </div>

                  <button
                    type='button'
                    onClick={() => remove(item.key)}
                    className='teduh-tap transition-colors duration-200'
                    style={{ fontSize: 'var(--teduh-small)', color: 'var(--teduh-ink-soft)' }}
                  >
                    {dict.cart.remove}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Summary — sticky on desktop, inline on mobile where sticky would eat
          the small viewport. */}
      <aside className='lg:sticky lg:self-start' style={{ top: 96 }}>
        <div className='plb-6 pli-6 teduh-panel' style={{ backgroundColor: 'var(--teduh-paper-warm)' }}>
          <div className='flex items-baseline justify-between'>
            <span className='teduh-eyebrow'>
              {count} {count === 1 ? dict.cart.item : dict.cart.items}
            </span>
          </div>

          <div className='mbs-4 flex items-baseline justify-between'>
            <span style={{ fontSize: 'var(--teduh-h3)' }}>{dict.cart.total}</span>
            <span style={{ fontSize: 'var(--teduh-h3)', fontWeight: 600, color: 'var(--teduh-ochre)' }}>
              {formatIdr(total)}
            </span>
          </div>

          <p className='mbs-1' style={{ fontSize: 'var(--teduh-micro)', color: 'var(--teduh-ink-soft)' }}>
            {dict.cart.shippingNote}
          </p>

          <div className='mbs-6'>
            <label
              htmlFor='cart-note'
              className='teduh-eyebrow'
              style={{ display: 'block', marginBlockEnd: 8 }}
            >
              {dict.cart.note}
            </label>
            <textarea
              id='cart-note'
              rows={3}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder={dict.cart.notePlaceholder}
              className='is-full plb-3 pli-3 border'
              style={{
                borderColor: 'var(--teduh-line)',
                backgroundColor: 'var(--teduh-paper)',
                fontFamily: 'inherit',
                fontSize: 'var(--teduh-small)',
                resize: 'vertical'
              }}
            />
          </div>

          {/* The handoff. target=_blank so the cart survives in the original tab
              if the customer comes back to adjust it. */}
          <a
            href={waUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='teduh-tap teduh-btn mbs-5 is-full flex items-center justify-center gap-2 transition-colors duration-200'
            style={{
              fontSize: 'var(--teduh-small)',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--teduh-paper)',
              backgroundColor: 'var(--teduh-ink)'
            }}
          >
            <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
              <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z' />
            </svg>
            {dict.cart.checkout}
          </a>

          <p className='mbs-3' style={{ fontSize: 'var(--teduh-micro)', color: 'var(--teduh-ink-soft)' }}>
            {dict.cart.checkoutHint}
          </p>
        </div>
      </aside>
    </div>
  )
}

export default CartView
