'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'

// Next Imports
import Link from 'next/link'
import Image from 'next/image'

// Type Imports
import type { Lang, Dictionary } from '@/dictionaries'

// Context Imports
import { useCart } from '@/contexts/cartContext'

// Util Imports
import { formatIdr, formatWeight } from '@/utils/format'
import { EMPTY_CART_ART } from '@/utils/images'

type Props = {
  lang: Lang
  dict: Dictionary
}

/** Beyond this the panel would be taller than most laptop viewports. */
const PREVIEW_LIMIT = 3

/*
 * Hover preview on the cart icon.
 *
 * Desktop only, and deliberately so: hover does not exist on touch, and a panel
 * that opens on tap would fight the link itself. On mobile the icon stays what
 * it always was — a link straight to the cart page.
 *
 * The icon remains a real <Link> in every case. The panel is an enhancement
 * layered over it, never the only way to reach the cart, so keyboard and
 * no-JS users lose nothing.
 */
const CartMenu = ({ lang, dict }: Props) => {
  const { items, count, total, hydrated } = useCart()
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // A short grace period on leave: the gap between the icon and the panel is
  // easy to cross diagonally, and closing instantly makes the panel feel like
  // it is dodging the pointer.
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), 140)
  }

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }

  useEffect(() => () => (closeTimer.current ? clearTimeout(closeTimer.current) : undefined), [])

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKey)

    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const visible = items.slice(0, PREVIEW_LIMIT)
  const overflow = count - visible.reduce((sum, i) => sum + i.qty, 0)

  return (
    <div
      className='relative flex items-center'
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
      onFocus={cancelClose}
      onBlur={scheduleClose}
    >
      <Link
        href={`/${lang}/keranjang`}
        className='teduh-tap flex items-center justify-center relative'
        aria-label={`${dict.nav.cart}${hydrated && count > 0 ? ` (${count})` : ''}`}
      >
        <svg width='21' height='21' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
          <path d='M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6ZM3 6h18M16 10a4 4 0 0 1-8 0' />
        </svg>
        {hydrated && count > 0 && (
          <span
            className='absolute flex items-center justify-center rounded-full'
            style={{
              insetBlockStart: 2,
              insetInlineEnd: 0,
              minInlineSize: 17,
              blockSize: 17,
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--teduh-paper)',
              backgroundColor: 'var(--teduh-ochre)'
            }}
          >
            {count}
          </span>
        )}
      </Link>

      {/* Rendered only after hydration: before localStorage is read the cart
          always looks empty, and flashing "your cart is empty" at someone who
          has three bags in it is worse than showing nothing. */}
      {hydrated && (
        <div className='teduh-cart-pop hidden md:block' data-open={open ? 'true' : 'false'} aria-hidden={!open}>
          {count === 0 ? (
            <div className='plb-8 pli-7 text-center'>
              {/* Supplied artwork. Not decorative-only in the a11y sense — it
                  carries the same message as the heading beneath it, so it is
                  marked presentational to avoid a screen reader announcing the
                  point twice. */}
              <Image
                src={EMPTY_CART_ART}
                alt=''
                width={482}
                height={249}
                sizes='272px'
                className='mli-auto'
                style={{ inlineSize: '100%', blockSize: 'auto' }}
              />

              <p
                className='mbs-5'
                style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.15rem', fontWeight: 600 }}
              >
                {dict.cartMenu.emptyTitle}
              </p>

              <p
                className='mbs-2'
                style={{ fontSize: 'var(--teduh-small)', color: 'var(--teduh-ink-soft)', lineHeight: 1.6 }}
              >
                {dict.cartMenu.emptyLede}
              </p>

              <hr className='teduh-rule mbs-6' />

              <Link
                href={`/${lang}/koleksi`}
                className='teduh-tap teduh-btn mbs-6 is-full flex items-center justify-center'
                style={{
                  fontSize: 'var(--teduh-small)',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--teduh-paper)',
                  backgroundColor: 'var(--teduh-ink)'
                }}
                onClick={() => setOpen(false)}
              >
                {dict.cartMenu.emptyCta}
              </Link>
            </div>
          ) : (
            <div className='plb-5 pli-5'>
              <ul className='flex flex-col gap-4'>
                {visible.map(item => (
                  <li key={item.key} className='flex items-start gap-3'>
                    {item.image && (
                      <div className='relative shrink-0 teduh-media' style={{ inlineSize: 48, blockSize: 48 }}>
                        <Image src={item.image} alt='' fill sizes='48px' className='object-cover' />
                      </div>
                    )}
                    <div className='flex-auto min-is-0'>
                      <p className='truncate' style={{ fontSize: 'var(--teduh-small)', fontWeight: 600 }}>
                        {item.productName}
                      </p>
                      <p style={{ fontSize: 'var(--teduh-micro)', color: 'var(--teduh-ink-soft)' }}>
                        {formatWeight(item.weightG)} · {item.grindName} · {item.qty}×
                      </p>
                    </div>
                    <p className='shrink-0' style={{ fontSize: 'var(--teduh-small)' }}>
                      {formatIdr(item.unitPriceIdr * item.qty)}
                    </p>
                  </li>
                ))}
              </ul>

              {overflow > 0 && (
                <p className='mbs-3' style={{ fontSize: 'var(--teduh-micro)', color: 'var(--teduh-ink-soft)' }}>
                  +{overflow} {dict.cartMenu.more}
                </p>
              )}

              <hr className='teduh-rule mbs-5' />

              <div className='mbs-4 flex items-baseline justify-between'>
                <span className='teduh-eyebrow'>{dict.cart.subtotal}</span>
                <span style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.15rem' }}>
                  {formatIdr(total)}
                </span>
              </div>

              <p className='mbs-1' style={{ fontSize: 'var(--teduh-micro)', color: 'var(--teduh-ink-soft)' }}>
                {dict.cart.shippingNote}
              </p>

              <Link
                href={`/${lang}/keranjang`}
                className='teduh-tap teduh-btn mbs-5 is-full flex items-center justify-center'
                style={{
                  fontSize: 'var(--teduh-small)',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--teduh-paper)',
                  backgroundColor: 'var(--teduh-ink)'
                }}
                onClick={() => setOpen(false)}
              >
                {dict.cartMenu.viewCart}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CartMenu
