// Next Imports
import type { Metadata } from 'next'

// Type Imports
import type { Lang } from '@/dictionaries'

// Dictionary Imports
import { getDictionary, LANGS } from '@/dictionaries'

// Config Imports
import { SHOP } from '@/configs/shopConfig'

// Util Imports
import { buildGreetingUrl } from '@/utils/whatsapp'

export const generateStaticParams = () => LANGS.map(lang => ({ lang }))

export const generateMetadata = async (props: { params: Promise<{ lang: Lang }> }): Promise<Metadata> => {
  const { lang } = await props.params
  const dict = await getDictionary(lang)

  return { title: `${dict.contact.title} — Kopi Teduh Roastery` }
}

/*
 * No contact form, deliberately.
 *
 * The WordPress form posted to dekate.id@gmail.com (the agency, not the client)
 * and a form here would need a mail service, spam handling, and a destination
 * nobody has confirmed. WhatsApp is already how this business takes orders, so
 * every route below is a direct line rather than a message into a void.
 */
const ContactPage = async (props: { params: Promise<{ lang: Lang }> }) => {
  const { lang } = await props.params
  const dict = await getDictionary(lang)

  const blocks = [
    { label: dict.contact.address, value: SHOP.address, href: SHOP.maps, external: true },
    { label: dict.contact.hours, value: SHOP.hours[lang] },
    { label: dict.contact.phone, value: SHOP.phoneDisplay, href: `tel:+${SHOP.whatsapp}` },
    { label: dict.contact.email, value: SHOP.email, href: `mailto:${SHOP.email}` }
  ]

  return (
    <div className='mli-auto is-full max-is-[1200px] pli-5 plb-12 md:plb-20'>
      <p className='teduh-eyebrow'>{dict.nav.contact}</p>

      <h1 className='mbs-3' style={{ fontSize: 'var(--teduh-h1)', maxInlineSize: '16ch' }}>
        {dict.contact.title}
      </h1>

      <div className='mbs-12 grid gap-12 md:gap-16 md:grid-cols-[1fr_380px] md:items-start'>
        <dl className='grid gap-0'>
          {blocks.map(block => (
            <div key={block.label} className='plb-6 border-bs' style={{ borderColor: 'var(--teduh-line)' }}>
              <dt className='teduh-eyebrow'>{block.label}</dt>
              <dd className='mbs-2' style={{ margin: 0, maxInlineSize: '46ch' }}>
                {block.href ? (
                  <a
                    href={block.href}
                    className='teduh-tap inline-flex items-center transition-colors duration-200'
                    style={{ color: 'var(--teduh-ink)' }}
                    {...(block.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {block.value}
                  </a>
                ) : (
                  block.value
                )}
              </dd>
            </div>
          ))}
        </dl>

        <aside className='plb-8 pli-7 teduh-panel' style={{ backgroundColor: 'var(--teduh-paper-warm)' }}>
          <p className='teduh-eyebrow'>WhatsApp</p>

          <p className='mbs-3' style={{ fontSize: 'var(--teduh-h3)', fontFamily: 'var(--font-display), serif' }}>
            {lang === 'id' ? 'Cara tercepat menghubungi kami' : 'The fastest way to reach us'}
          </p>

          <p className='mbs-3' style={{ fontSize: 'var(--teduh-small)', color: 'var(--teduh-ink-soft)' }}>
            {lang === 'id'
              ? 'Pesanan, tanya stok, atau reservasi tempat — semuanya lewat WhatsApp.'
              : 'Orders, stock enquiries, or table reservations — all through WhatsApp.'}
          </p>

          <a
            href={buildGreetingUrl(lang)}
            target='_blank'
            rel='noopener noreferrer'
            className='teduh-tap teduh-btn mbs-6 is-full flex items-center justify-center gap-2 transition-colors duration-200'
            style={{
              fontSize: 'var(--teduh-small)',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--teduh-paper)',
              backgroundColor: 'var(--teduh-ink)'
            }}
          >
            <svg width='17' height='17' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
              <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z' />
            </svg>
            {dict.contact.whatsapp}
          </a>
        </aside>
      </div>
    </div>
  )
}

export default ContactPage
