import 'server-only'

// Third-party Imports
import { unstable_cache } from 'next/cache'

// Lib Imports
import prisma from './prisma'

// Cache tag for on-demand revalidation. The admin's save action calls
// revalidateTag(PRODUCTS_TAG), which is what lets these queries cache
// indefinitely instead of polling on a timer.
export const PRODUCTS_TAG = 'products'

// Shared shape: everything a card or a detail page needs, fetched in one go.
// The catalog is five rows, so over-fetching costs nothing and avoids N+1.
const productInclude = {
  variants: {
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' }
  },
  tastingNotes: { orderBy: { sortOrder: 'asc' } },
  varietals: { include: { varietal: true } },
  images: { orderBy: { sortOrder: 'asc' } }
} as const

export const getProducts = unstable_cache(
  async () =>
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: productInclude
    }),
  ['products-all'],
  { tags: [PRODUCTS_TAG] }
)

export const getFeaturedProducts = unstable_cache(
  async () =>
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { sortOrder: 'asc' },
      include: productInclude
    }),
  ['products-featured'],
  { tags: [PRODUCTS_TAG] }
)

export const getProductBySlug = (slug: string) =>
  unstable_cache(
    async () =>
      prisma.product.findFirst({
        where: { slug, isActive: true },
        include: productInclude
      }),
    ['product', slug],
    { tags: [PRODUCTS_TAG] }
  )()

export const getGrindOptions = unstable_cache(
  async () =>
    prisma.grindOption.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    }),
  ['grind-options'],
  { tags: [PRODUCTS_TAG] }
)

// Inferred rather than hand-written, so the include above stays the single
// source of truth for what a product carries.
export type ProductWithRelations = Awaited<ReturnType<typeof getProducts>>[number]
export type GrindOptionRecord = Awaited<ReturnType<typeof getGrindOptions>>[number]
