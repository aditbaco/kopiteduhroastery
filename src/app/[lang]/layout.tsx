// Next Imports
import { notFound } from 'next/navigation'
import { Fraunces, Karla } from 'next/font/google'

import type { Metadata } from 'next'

// Type Imports
import type { Lang } from '@/dictionaries'

// Dictionary Imports
import { LANGS, getDictionary, isLang } from '@/dictionaries'

// Context Imports
import { CartProvider } from '@/contexts/cartContext'

// Component Imports
import StorefrontHeader from '@/components/storefront/Header'
import StorefrontFooter from '@/components/storefront/Footer'

// Style Imports
import '../storefront.css'

// Fraunces carries the character — a variable serif with a "soft" optical axis
// that reads warm and hand-cut rather than corporate. Karla underneath keeps
// body copy plain and legible at 16px on a phone.
// Loaded as a variable font: `axes` requires the weight axis stay variable, so
// no `weight` array here. SOFT rounds the terminals, WONK enables the canted
// alternates — together they are what keep it from reading as a stock serif.
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['SOFT', 'WONK'],
  variable: '--font-display',
  display: 'swap'
})

const karla = Karla({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap'
})

export const generateStaticParams = () => LANGS.map(lang => ({ lang }))

export const generateMetadata = async (props: { params: Promise<{ lang: string }> }): Promise<Metadata> => {
  const { lang } = await props.params

  if (!isLang(lang)) return {}

  const dict = await getDictionary(lang)

  return {
    title: dict.meta.title,
    description: dict.meta.description,

    // Tells crawlers the two versions are translations of each other rather
    // than duplicate content.
    alternates: {
      languages: Object.fromEntries(LANGS.map(l => [l, `/${l}`]))
    }
  }
}

const StorefrontLayout = async (props: { children: React.ReactNode; params: Promise<{ lang: string }> }) => {
  const { children, params } = props
  const { lang } = await params

  // The [lang] segment sits at the root, so it would otherwise swallow any
  // unmatched single-segment path. Reject anything that is not a real locale.
  if (!isLang(lang)) notFound()

  const dict = await getDictionary(lang)

  return (
    <div className={`teduh ${fraunces.variable} ${karla.variable} flex flex-col min-bs-screen`}>
      {/* <html lang> lives in the root layout, which is static and cannot know
          the locale. Correcting it here keeps screen readers on the right
          pronunciation without making the root layout dynamic.

          Not an injection vector: isLang() above has already narrowed `lang` to
          the literal 'id' | 'en' and called notFound() otherwise, so no
          attacker-controlled string can reach this. It is interpolated via
          JSON.stringify as a second layer rather than as the only one. */}
      <script
        dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(lang as Lang)}` }}
      />
      <CartProvider>
        <StorefrontHeader lang={lang as Lang} dict={dict} />
        <main className='flex-auto'>{children}</main>
        <StorefrontFooter lang={lang as Lang} dict={dict} />
      </CartProvider>
    </div>
  )
}

export default StorefrontLayout
