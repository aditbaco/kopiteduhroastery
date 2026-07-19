// Next Imports
import Link from 'next/link'

// Type Imports
import type { Lang, Dictionary } from '@/dictionaries'
import type { LegalDoc, LegalDocKey } from '@/data/legal'

// Data Imports
import { LEGAL_DOCS, LEGAL_SLUG, LEGAL_UPDATED } from '@/data/legal'

type Props = {
  lang: Lang
  dict: Dictionary
  docKey: LegalDocKey
}

/*
 * One layout for all three information pages: single measured column, no
 * imagery. These are read, not browsed — the only job is legibility, so the
 * measure is capped at 68ch and the type stays at body size throughout.
 *
 * The sibling links at the foot mean someone who lands on the terms from a
 * search result can reach the other two without going back to the footer.
 */
const LegalArticle = ({ lang, dict, docKey }: Props) => {
  const doc: LegalDoc = LEGAL_DOCS[docKey][lang]

  const siblings = (Object.keys(LEGAL_SLUG) as LegalDocKey[])
    .filter(key => key !== docKey)
    .map(key => ({
      key,
      href: `/${lang}/${LEGAL_SLUG[key]}`,
      label: key === 'guide' ? dict.legal.guide : key === 'privacy' ? dict.legal.privacy : dict.legal.terms
    }))

  return (
    <div className='mli-auto is-full max-is-[1200px] pli-5 plb-12 md:plb-20'>
      <header style={{ maxInlineSize: '68ch' }}>
        <p className='teduh-eyebrow'>{dict.legal.heading}</p>

        <h1 className='mbs-3' style={{ fontSize: 'var(--teduh-h1)', maxInlineSize: '18ch' }}>
          {doc.title}
        </h1>

        <p className='mbs-5' style={{ color: 'var(--teduh-ink-soft)', lineHeight: 1.75 }}>
          {doc.lede}
        </p>

        <p className='mbs-4' style={{ fontSize: 'var(--teduh-micro)', color: 'var(--teduh-ink-soft)', opacity: 0.75 }}>
          {dict.legal.updated}: {LEGAL_UPDATED}
        </p>
      </header>

      <div className='mbs-12 flex flex-col gap-10' style={{ maxInlineSize: '68ch' }}>
        {doc.sections.map(section => (
          <section key={section.heading}>
            <h2 style={{ fontSize: 'var(--teduh-h3)' }}>{section.heading}</h2>
            <hr className='teduh-rule mbs-4' />

            {section.body && (
              <div className='mbs-5 flex flex-col gap-4'>
                {section.body.map((para, i) => (
                  <p key={i} style={{ lineHeight: 1.75 }}>
                    {para}
                  </p>
                ))}
              </div>
            )}

            {/* Counter-based numbering rather than list-style: the marker needs
                to sit in the ochre display face, which list markers cannot be
                styled into reliably across browsers. */}
            {section.steps && (
              <ol className='teduh-steps mbs-6'>
                {section.steps.map(step => (
                  <li key={step.title}>
                    <p style={{ fontWeight: 600 }}>{step.title}</p>
                    <p className='mbs-1' style={{ color: 'var(--teduh-ink-soft)', lineHeight: 1.75 }}>
                      {step.detail}
                    </p>
                  </li>
                ))}
              </ol>
            )}

            {section.points && (
              <ul className='teduh-points mbs-5'>
                {section.points.map(point => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <nav className='mbs-16 flex flex-wrap items-center gap-x-6 gap-y-2' style={{ maxInlineSize: '68ch' }}>
        {siblings.map(item => (
          <Link
            key={item.key}
            href={item.href}
            className='teduh-tap inline-flex items-center transition-colors duration-200'
            style={{ fontSize: 'var(--teduh-small)', color: 'var(--teduh-ochre)' }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default LegalArticle
