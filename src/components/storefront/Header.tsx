'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

// Type Imports
import type { Lang, Dictionary } from '@/dictionaries'

// Component Imports
import CartMenu from './CartMenu'

// Util Imports
import { buildGreetingUrl } from '@/utils/whatsapp'

type Props = {
  lang: Lang
  dict: Dictionary
}

const StorefrontHeader = ({ lang, dict }: Props) => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const nav = [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/koleksi`, label: dict.nav.shop },
    { href: `/${lang}/tentang`, label: dict.nav.about },
    { href: `/${lang}/kontak`, label: dict.nav.contact }
  ]

  // Solid once the page moves at all. Transparent only while sitting over the
  // hero, where the headline supplies its own contrast.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the drawer on route change, otherwise it stays open over the new page.
  useEffect(() => setOpen(false), [pathname])

  // Escape closes; body scroll locks while the panel is up so the page behind
  // does not scroll under the visitor's finger.
  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    const prev = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const otherLang: Lang = lang === 'id' ? 'en' : 'id'
  const swapLangHref = pathname.replace(/^\/(id|en)/, `/${otherLang}`) || `/${otherLang}`

  const isActive = (href: string) => (href === `/${lang}` ? pathname === href : pathname.startsWith(href))

  // Opaque whenever it is not floating over the hero.
  const solid = scrolled || open

  return (
    <>
      {/* Sibling of the header, not a child: a negative-z-index child paints
          above its parent's background, which tinted the bar itself. */}
      <div
        className='teduh-scrim md:hidden'
        data-open={open ? 'true' : 'false'}
        onClick={() => setOpen(false)}
        aria-hidden='true'
      />

      <header
        className='sticky teduh-header'
        data-solid={solid ? 'true' : 'false'}
        style={{ top: 0, zIndex: 'var(--z-header)' as never }}
      >
        <div className='mli-auto is-full max-is-[1200px] plb-3 pli-5 flex items-center justify-between gap-4'>
          <button
            type='button'
            className='teduh-tap teduh-burger md:hidden -mli-2'
            aria-label={open ? dict.common.close : dict.common.menu}
            aria-expanded={open}
            aria-controls='teduh-mobile-nav'
            onClick={() => setOpen(o => !o)}
            data-open={open ? 'true' : 'false'}
          >
            <span aria-hidden='true' />
            <span aria-hidden='true' />
          </button>

          <Link href={`/${lang}`} className='flex items-center shrink-0' aria-label='Kopi Teduh Roastery'>
            {/* sizes is required here: without it Next requests the largest
                srcset candidate (w=3840) for a logo drawn 34px tall, which
                stalled the request and left the header logo blank on desktop. */}
            <Image
              src='/images/logo/lockup-dark.png'
              alt='Kopi Teduh Roastery'
              width={560}
              height={173}
              sizes='140px'
              priority
              style={{ height: 34, width: 'auto' }}
            />
          </Link>

          <nav className='hidden md:flex items-center gap-7'>
            {nav.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className='teduh-tap flex items-center transition-colors duration-200'
                style={{
                  fontSize: 'var(--teduh-small)',
                  color: isActive(item.href) ? 'var(--teduh-ochre)' : 'var(--teduh-ink-soft)'
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className='flex items-center gap-1'>
            <Link
              href={swapLangHref}
              className='teduh-tap flex items-center justify-center transition-colors duration-200'
              style={{ fontSize: 'var(--teduh-micro)', letterSpacing: '0.1em', color: 'var(--teduh-ink-soft)' }}
              aria-label={`${dict.common.langLabel}: ${otherLang.toUpperCase()}`}
            >
              {otherLang.toUpperCase()}
            </Link>

            {/* Icon, badge and hover preview all live in CartMenu now. */}
            <CartMenu lang={lang} dict={dict} />
          </div>
        </div>

        {/* Single wrapper child: grid-template-rows:0fr collapses only the first
          explicit row, so any sibling would land in an implicit auto row and
          stay visible while closed. */}
        <nav id='teduh-mobile-nav' className='teduh-drawer md:hidden' data-open={open ? 'true' : 'false'}>
          <div>
            <ul>
              {nav.map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className='teduh-drawer-item'
                    data-active={isActive(item.href) ? 'true' : 'false'}
                  >
                    <span>{item.label}</span>
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
                      <path d='m9 18 6-6-6-6' strokeLinecap='round' strokeLinejoin='round' />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Direct line to the shop — the action most mobile visitors want. */}
            <a href={buildGreetingUrl(lang)} target='_blank' rel='noopener noreferrer' className='teduh-drawer-cta'>
              <svg width='17' height='17' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
                <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z' />
              </svg>
              {dict.contact.whatsapp}
            </a>
          </div>
        </nav>
      </header>
    </>
  )
}

export default StorefrontHeader
