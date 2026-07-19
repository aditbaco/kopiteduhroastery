'use client'

// React Imports
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

const STORAGE_KEY = 'teduh-cart-v1'

export type CartItem = {

  // Identity of a cart line is (variant + grind): the same coffee at the same
  // weight but ground differently is a separate line to pack.
  key: string
  productSlug: string
  productName: string
  variantId: number
  weightG: number
  grindSlug: string
  grindName: string
  unitPriceIdr: number
  image?: string | null
  qty: number
}

type CartContextValue = {
  items: CartItem[]
  count: number
  total: number
  hydrated: boolean
  add: (item: Omit<CartItem, 'key' | 'qty'>, qty?: number) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export const lineKey = (variantId: number, grindSlug: string) => `${variantId}:${grindSlug}`

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])

  // `hydrated` guards against a flash of an empty cart: the server renders 0
  // items, so the badge must not paint a real count until localStorage is read.
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)

      if (raw) setItems(JSON.parse(raw) as CartItem[])
    } catch {
      // Corrupt or unavailable storage (private mode, quota) — start empty
      // rather than breaking the page.
    }

    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Quota exceeded — the cart still works for this session.
    }
  }, [items, hydrated])

  const add = useCallback((item: Omit<CartItem, 'key' | 'qty'>, qty = 1) => {
    const key = lineKey(item.variantId, item.grindSlug)

    setItems(prev => {
      const existing = prev.find(i => i.key === key)

      if (existing) {
        return prev.map(i => (i.key === key ? { ...i, qty: i.qty + qty } : i))
      }

      return [...prev, { ...item, key, qty }]
    })
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setItems(prev => (qty <= 0 ? prev.filter(i => i.key !== key) : prev.map(i => (i.key === key ? { ...i, qty } : i))))
  }, [])

  const remove = useCallback((key: string) => setItems(prev => prev.filter(i => i.key !== key)), [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0)
    const total = items.reduce((n, i) => n + i.unitPriceIdr * i.qty, 0)

    return { items, count, total, hydrated, add, setQty, remove, clear }
  }, [items, hydrated, add, setQty, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)

  if (!ctx) throw new Error('useCart must be used within a CartProvider')

  return ctx
}
