// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

/*
 * Deliberately free of cookies()/headers().
 *
 * The root layout wraps every route, so a dynamic API here opts the WHOLE app
 * out of static rendering — which would silently defeat the storefront's
 * on-demand ISR. Colour-scheme setup lives in the admin layouts instead, since
 * only the admin uses the MUI theme; both already read the cookie themselves.
 *
 * `lang` defaults to Indonesian; the storefront's [lang] layout corrects it for
 * English routes.
 */

export const metadata = {
  title: 'Kopi Teduh Roastery',
  description: 'Roastery kopi spesialti dari Poso, Sulawesi Tengah.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Kopi Teduh Roastery',
    description: 'Roastery kopi spesialti dari Poso, Sulawesi Tengah.',
    siteName: 'Kopi Teduh Roastery',
    images: [
      {
        url: '/apple-icon.png',
        width: 180,
        height: 180,
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kopi Teduh Roastery',
    description: 'Roastery kopi spesialti dari Poso, Sulawesi Tengah.',
    images: ['/apple-icon.png'],
  },
}

const RootLayout = (props: ChildrenType) => {
  const { children } = props

  return (
    <html id='__next' lang='id' dir='ltr' suppressHydrationWarning>
      <body className='flex is-full min-bs-full flex-auto flex-col'>{children}</body>
    </html>
  )
}

export default RootLayout
