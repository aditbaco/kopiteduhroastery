// Next Imports
import Image from 'next/image'
import Link from 'next/link'

import type { Metadata } from 'next'

// Type Imports
import type { Lang } from '@/dictionaries'

// Dictionary Imports
import { getDictionary, LANGS } from '@/dictionaries'

export const generateStaticParams = () => LANGS.map(lang => ({ lang }))

export const generateMetadata = async (props: { params: Promise<{ lang: Lang }> }): Promise<Metadata> => {
  const { lang } = await props.params
  const dict = await getDictionary(lang)

  return { title: `${dict.nav.about} — Kopi Teduh Roastery` }
}

/*
 * Copy carried over from the WordPress "Tentang Kami" page — the Filosofi
 * paragraph is the client's own writing and the strongest original text on the
 * old site, so it is preserved verbatim rather than rewritten.
 */
const ABOUT = {
  id: {
    quote: 'The smell of fresh-made coffee is one of the greatest inventions of mankind.',
    heading: 'Kedai kopi & roastery, dari Poso',
    philosophyLabel: 'Filosofi',
    body: [
      'Kedai kopi artisan dengan semangat berkelanjutan. Menyebarluaskan Kopi Lore dari saudara-saudara petani di kebun, dengan menyamakan persepsi antara “bertani kopi yang baik” hingga menikmati kopi dengan baik.',
      '“Dot connector” — jalan ninja yang kami pilih, sebagai penyambung lidah bagi hulu dan hilir industri kopi. Lantas kami seduhkan kopi dan cerita di baliknya, untuk melengkapi kenikmatan ritual ngopi.',
      'Di kedai kami, Anda bisa datang sebagai pelanggan, pulang sebagai keluarga.'
    ],
    statsLabel: ['Kabupaten', 'Ketinggian kebun', 'Disangrai'],
    teamLabel: 'Tim Kami',
    teamHeading: 'Tim Kopi Teduh Roastery',

    // The WordPress original ran lorem ipsum here; written fresh rather than
    // carried over.
    teamLede:
      'Kopi yang baik tidak berhenti di kebun. Ini tim kecil yang menyangrai, menakar, dan menyeduhnya setiap hari — dan yang akan menyambut Anda di kedai.'
  },
  en: {
    quote: 'The smell of fresh-made coffee is one of the greatest inventions of mankind.',
    heading: 'A coffee shop & roastery, from Poso',
    philosophyLabel: 'Philosophy',
    body: [
      'An artisan coffee shop with a sustainable spirit. We share Kopi Lore from our farming brothers and sisters in the gardens, aligning what it means to “farm coffee well” with what it means to drink it well.',
      '“Dot connector” is the path we chose — an interpreter between the upstream and downstream ends of the coffee industry. So we brew the coffee and the story behind it, to complete the ritual of ngopi.',
      'At our shop, you can arrive as a customer and leave as family.'
    ],
    statsLabel: ['Regencies', 'Garden altitude', 'Roasted'],
    teamLabel: 'Our Team',
    teamHeading: 'The Kopi Teduh Roastery team',
    teamLede:
      'Good coffee does not stop at the garden. This is the small team that roasts, weighs and brews it every day — and the people who will greet you at the shop.'
  }
} as const

/*
 * Names, roles and photographs are the real ones from the WordPress site.
 *
 * Deliberately dropped: the per-member bios ("A small river named Duden…" was
 * untouched theme filler) and the contact details, which were all
 * info@example.com and a US phone number. Better to show nothing than fake
 * contacts on a real person's photo.
 *
 * "Roaaster" on the old site is corrected to "Roaster" here.
 */
const TEAM = [
  { name: 'Irvan a.k.a None', role: { id: 'Barista', en: 'Barista' }, photo: '/images/team/irvan.jpg' },
  { name: 'Mahris', role: { id: 'Roaster', en: 'Roaster' }, photo: '/images/team/mahris.jpg' },
  { name: 'Trisnohadi', role: { id: 'Barista', en: 'Barista' }, photo: '/images/team/trisnohadi.jpg' }
] as const

const AboutPage = async (props: { params: Promise<{ lang: Lang }> }) => {
  const { lang } = await props.params
  const dict = await getDictionary(lang)
  const copy = ABOUT[lang]

  const stats = [
    { value: '2', label: copy.statsLabel[0] },
    { value: '750–1.300', label: copy.statsLabel[1] },
    { value: lang === 'id' ? 'Tiap minggu' : 'Weekly', label: copy.statsLabel[2] }
  ]

  return (
    <div>
      <div className='mli-auto is-full max-is-[1200px] pli-5 plb-12 md:plb-20'>
        <p className='teduh-eyebrow'>{dict.nav.about}</p>

        <h1 className='mbs-3' style={{ fontSize: 'var(--teduh-h1)', maxInlineSize: '18ch' }}>
          {copy.heading}
        </h1>

        <div className='mbs-12 grid gap-10 md:gap-14 md:grid-cols-2 md:items-start'>
          {/* The roastery's own signage, from the WordPress Tentang Kami page —
              paired with the pull-quote exactly as the original did. Replaces
              the Unsplash placeholder: it is the real shop, and it happens to
              show the brand literally sitting in shade ("teduh"). */}
          <div className='relative teduh-media-lg' style={{ aspectRatio: '4 / 5' }}>
            <Image
              src='/images/about/kopi-teduh-sign.jpg'
              alt={
                lang === 'id'
                  ? 'Papan nama Kopi Teduh Cafe & Roastery tergantung di bawah rimbun pepohonan'
                  : 'The Kopi Teduh Cafe & Roastery sign hanging in the shade of the trees'
              }
              fill
              priority
              sizes='(max-width: 768px) 100vw, 520px'
              className='object-cover'
            />
          </div>

          <div>
            <p className='teduh-eyebrow'>{copy.philosophyLabel}</p>
            <hr className='teduh-rule mbs-4' />

            <blockquote
              className='mbs-6'
              style={{
                fontFamily: 'var(--font-display), serif',
                fontSize: 'var(--teduh-h3)',
                lineHeight: 1.3,
                color: 'var(--teduh-ink)',
                margin: 0,
                maxInlineSize: '24ch'
              }}
            >
              “{copy.quote}”
            </blockquote>

            <div className='mbs-7 flex flex-col gap-4' style={{ maxInlineSize: '54ch' }}>
              {copy.body.map((para, i) => (
                <p key={i} style={{ lineHeight: 1.75 }}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Facts band */}
      <section className='relative teduh-grain' style={{ backgroundColor: 'var(--teduh-ink)' }}>
        <div className='mli-auto is-full max-is-[1200px] pli-5 plb-14 grid gap-8 grid-cols-1 sm:grid-cols-3'>
          {stats.map(stat => (
            <div key={stat.label} style={{ color: 'var(--teduh-paper)' }}>
              <p style={{ fontFamily: 'var(--font-display), serif', fontSize: 'var(--teduh-h2)', lineHeight: 1 }}>
                {stat.value}
              </p>
              <p className='teduh-eyebrow mbs-2' style={{ color: 'var(--teduh-paper)', opacity: 0.55 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tim Kami */}
      <section className='mli-auto is-full max-is-[1200px] pli-5 plb-16 md:plb-24'>
        <div className='grid gap-6 md:grid-cols-2 md:items-start md:gap-16'>
          <div>
            <p className='teduh-eyebrow' style={{ color: 'var(--teduh-ochre)' }}>
              {copy.teamLabel}
            </p>
            <span
              className='block mbs-3'
              style={{ inlineSize: 56, blockSize: 2, backgroundColor: 'var(--teduh-ochre)' }}
              aria-hidden='true'
            />
            <h2 className='mbs-5' style={{ fontSize: 'var(--teduh-h2)', maxInlineSize: '14ch' }}>
              {copy.teamHeading}
            </h2>
          </div>

          <p className='md:mbs-12' style={{ color: 'var(--teduh-ink-soft)', maxInlineSize: '46ch' }}>
            {copy.teamLede}
          </p>
        </div>

        <ul className='mbs-12 md:mbs-16 grid gap-10 grid-cols-1 sm:grid-cols-3 sm:gap-8'>
          {TEAM.map(member => (
            <li key={member.name} className='flex flex-col items-center text-center'>
              <div
                className='relative overflow-hidden rounded-full'
                style={{
                  inlineSize: '100%',
                  maxInlineSize: 260,
                  aspectRatio: '1 / 1',
                  backgroundColor: 'var(--teduh-paper-warm)'
                }}
              >
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  sizes='(max-width: 640px) 260px, 260px'
                  className='object-cover'
                />
              </div>

              <p className='mbs-5' style={{ fontFamily: 'var(--font-display), serif', fontSize: 'var(--teduh-h3)' }}>
                {member.name}
              </p>
              <p className='teduh-eyebrow mbs-1'>{member.role[lang]}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className='mli-auto is-full max-is-[1200px] pli-5 pbe-14 md:pbe-20'>
        <Link
          href={`/${lang}/koleksi`}
          className='teduh-tap inline-flex items-center gap-3'
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
          {dict.home.allProducts}
          <span aria-hidden='true'>→</span>
        </Link>
      </div>
    </div>
  )
}

export default AboutPage
