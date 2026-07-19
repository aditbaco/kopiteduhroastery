// Next Imports
import Link from 'next/link'
import { Fraunces, Karla } from 'next/font/google'

// Style Imports
import './storefront.css'

/*
 * Storefront-styled rather than admin-styled: anyone hitting a bad URL is far
 * more likely to be a customer than an admin.
 *
 * Deliberately free of cookies()/MUI Providers so it stays statically
 * rendered — and bilingual, because it is shared by both locales and cannot
 * know which one the visitor wanted.
 */

const fraunces = Fraunces({ subsets: ['latin'], axes: ['SOFT', 'WONK'], variable: '--font-display', display: 'swap' })
const karla = Karla({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-body', display: 'swap' })

const NotFound = () => {
  return (
    <div
      className={`teduh ${fraunces.variable} ${karla.variable} flex flex-col items-center justify-center flex-auto text-center pli-5 plb-24`}
    >
      <p className='teduh-eyebrow'>404</p>

      <h1 className='teduh-display mbs-4' style={{ maxInlineSize: '14ch' }}>
        Halaman tidak ditemukan
      </h1>

      <p className='mbs-4' style={{ color: 'var(--teduh-ink-soft)', maxInlineSize: '40ch' }}>
        Halaman yang Anda cari sudah dipindahkan atau tidak pernah ada.
        <br />
        <span style={{ fontSize: 'var(--teduh-small)' }}>
          The page you are looking for has moved, or never existed.
        </span>
      </p>

      <div className='mbs-8 flex flex-wrap items-center justify-center gap-6'>
        <Link
          href='/id'
          className='teduh-tap inline-flex items-center gap-2'
          style={{
            fontSize: 'var(--teduh-small)',
            fontWeight: 600,
            color: 'var(--teduh-ochre)',
            borderBlockEnd: '1px solid var(--teduh-ochre)',
            paddingBlockEnd: 4
          }}
        >
          Beranda
        </Link>

        <Link
          href='/en'
          className='teduh-tap inline-flex items-center gap-2'
          style={{
            fontSize: 'var(--teduh-small)',
            fontWeight: 600,
            color: 'var(--teduh-ink-soft)',
            borderBlockEnd: '1px solid var(--teduh-line)',
            paddingBlockEnd: 4
          }}
        >
          Home (EN)
        </Link>
      </div>
    </div>
  )
}

export default NotFound
