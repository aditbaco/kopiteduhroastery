// Next Imports
import Link from 'next/link'
import Image from 'next/image'

// Type Imports
import type { Lang, Dictionary } from '@/dictionaries'

// Component Imports
import SocialIcon from './SocialIcon'
import type { SocialKey } from './SocialIcon'

// Config Imports
import { SHOP } from '@/configs/shopConfig'

// Data Imports
import { LEGAL_SLUG } from '@/data/legal'

// Util Imports
import { buildGreetingUrl } from '@/utils/whatsapp'

type Props = {
  lang: Lang
  dict: Dictionary
}

const StorefrontFooter = ({ lang, dict }: Props) => {
  const info = [
    { href: `/${lang}/${LEGAL_SLUG.guide}`, label: dict.legal.guide },
    { href: `/${lang}/${LEGAL_SLUG.privacy}`, label: dict.legal.privacy },
    { href: `/${lang}/${LEGAL_SLUG.terms}`, label: dict.legal.terms }
  ]

  return (
    <footer
      className='relative teduh-grain'
      style={{ backgroundColor: 'var(--teduh-ink)', color: 'var(--teduh-paper)' }}
    >
      <div className='mli-auto is-full max-is-[1200px] pli-5 plb-14'>
        <div className='grid gap-10 sm:grid-cols-2 md:grid-cols-4'>
          <div>
            {/* The white master lockup, used as supplied — the dark footer is
                exactly the background it was drawn for. */}
            <Image
              src='/images/logo/lockup-white.png'
              alt='Kopi Teduh Roastery'
              width={720}
              height={222}
              sizes='220px'
              style={{ height: 52, width: 'auto', marginBlockEnd: '1rem' }}
            />
            <p style={{ fontSize: 'var(--teduh-small)', opacity: 0.72, maxInlineSize: '32ch' }}>
              {dict.meta.description}
            </p>
          </div>

          <div>
            <p className='teduh-eyebrow' style={{ color: 'var(--teduh-paper)', opacity: 0.55 }}>
              {dict.contact.address}
            </p>
            <address className='not-italic mbs-3' style={{ fontSize: 'var(--teduh-small)', opacity: 0.82 }}>
              {SHOP.address}
            </address>
            <p className='mbs-3' style={{ fontSize: 'var(--teduh-small)', opacity: 0.82 }}>
              {SHOP.hours[lang]}
            </p>
          </div>

          <div>
            <p className='teduh-eyebrow' style={{ color: 'var(--teduh-paper)', opacity: 0.55 }}>
              {dict.contact.title}
            </p>
            <ul className='mbs-3 flex flex-col gap-1'>
              <li>
                <a
                  href={buildGreetingUrl(lang)}
                  className='teduh-tap inline-flex items-center transition-opacity duration-200'
                  style={{ fontSize: 'var(--teduh-small)', opacity: 0.82 }}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {dict.contact.whatsapp}
                </a>
              </li>
              <li>
                {/* Label rather than the raw address: shorter in a narrow
                    column, and it keeps the address off a page that scrapers
                    hit on every route. It is still shown in full on the
                    contact page, where people expect to read it. */}
                <a
                  href={`mailto:${SHOP.email}`}
                  className='teduh-tap inline-flex items-center transition-opacity duration-200'
                  style={{ fontSize: 'var(--teduh-small)', opacity: 0.82 }}
                >
                  {dict.contact.emailUs}
                </a>
              </li>
              <li>
                <Link
                  href={`/${lang}/koleksi`}
                  className='teduh-tap inline-flex items-center transition-opacity duration-200'
                  style={{ fontSize: 'var(--teduh-small)', opacity: 0.82 }}
                >
                  {dict.nav.shop}
                </Link>
              </li>
            </ul>

            {/* Icon-only links, so each needs an accessible name — the glyph
                itself is aria-hidden. */}
            <ul className='mbs-5 flex items-center gap-2'>
              {SHOP.social.map(item => (
                <li key={item.key}>
                  <a
                    href={item.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={item.label}
                    title={item.label}
                    className='teduh-social'
                  >
                    <SocialIcon name={item.key as SocialKey} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Information column. These three pages answer the questions a first
              -time buyer asks before committing to a WhatsApp conversation, so
              they belong in the footer of every page rather than the main nav. */}
          <div>
            <p className='teduh-eyebrow' style={{ color: 'var(--teduh-paper)', opacity: 0.55 }}>
              {dict.legal.heading}
            </p>
            <ul className='mbs-3 flex flex-col gap-1'>
              {info.map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className='teduh-tap inline-flex items-center transition-opacity duration-200'
                    style={{ fontSize: 'var(--teduh-small)', opacity: 0.82 }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className='teduh-rule mbs-10' style={{ backgroundColor: 'rgb(244 239 230 / 0.16)' }} />

        <div className='mbs-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2'>
          <p style={{ fontSize: 'var(--teduh-micro)', opacity: 0.5 }}>
            © {new Date().getFullYear()} Kopi Teduh Roastery — Poso, Sulawesi Tengah
          </p>

          <a
            href='https://dekate.id'
            target='_blank'
            rel='noopener noreferrer'
            className='teduh-tap inline-flex items-center transition-opacity duration-200 hover:opacity-90'
            style={{ fontSize: 'var(--teduh-micro)', opacity: 0.5 }}
          >
            Powered by dekate
          </a>
        </div>
      </div>
    </footer>
  )
}

export default StorefrontFooter
