// Next Imports
import type { Metadata } from 'next'

// Type Imports
import type { Lang } from '@/dictionaries'

// Dictionary Imports
import { getDictionary, LANGS } from '@/dictionaries'

// Data Imports
import { LEGAL_DOCS } from '@/data/legal'

// Component Imports
import LegalArticle from '@/components/storefront/LegalArticle'

export const generateStaticParams = () => LANGS.map(lang => ({ lang }))

export const generateMetadata = async (props: { params: Promise<{ lang: Lang }> }): Promise<Metadata> => {
  const { lang } = await props.params
  const doc = LEGAL_DOCS.terms[lang]

  return { title: `${doc.title} — Kopi Teduh Roastery`, description: doc.lede }
}

const TermsPage = async (props: { params: Promise<{ lang: Lang }> }) => {
  const { lang } = await props.params
  const dict = await getDictionary(lang)

  return <LegalArticle lang={lang} dict={dict} docKey='terms' />
}

export default TermsPage
