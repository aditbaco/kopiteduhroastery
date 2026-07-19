// Type Imports
import type { Lang } from '@/dictionaries'

// Dictionary Imports
import { getDictionary } from '@/dictionaries'

// Component Imports
import CartView from '@/components/storefront/CartView'

const CartPage = async (props: { params: Promise<{ lang: Lang }> }) => {
  const { lang } = await props.params
  const dict = await getDictionary(lang)

  return (
    <div className='mli-auto is-full max-is-[1200px] pli-5 plb-12 md:plb-20'>
      <h1 style={{ fontSize: 'var(--teduh-h1)' }}>{dict.cart.title}</h1>

      <div className='mbs-10'>
        <CartView lang={lang} dict={dict} />
      </div>
    </div>
  )
}

export default CartPage
