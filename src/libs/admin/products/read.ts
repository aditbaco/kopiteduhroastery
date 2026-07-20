import 'server-only'

// Lib Imports
import prisma from '@/libs/prisma'

// Deliberately uncached and unfiltered, unlike src/libs/products.ts. Two
// reasons: the admin must see inactive products and inactive variants (the
// storefront's include filters those out, which would silently hide rows from
// the edit form), and an admin who just saved should never wonder whether they
// are looking at a cached copy. This is a low-traffic internal tool.

export const listProductsForAdmin = async () =>
  prisma.product.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      variants: { orderBy: { sortOrder: 'asc' } }
    }
  })

export const getProductForEdit = async (id: number) =>
  prisma.product.findUnique({
    where: { id },
    include: {
      variants: { orderBy: { sortOrder: 'asc' } },
      tastingNotes: { orderBy: { sortOrder: 'asc' } },
      varietals: { select: { varietalId: true } }
    }
  })

export const listVarietals = async () =>
  prisma.varietal.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  })

export type AdminProductListItem = Awaited<ReturnType<typeof listProductsForAdmin>>[number]
export type AdminProductDetail = NonNullable<Awaited<ReturnType<typeof getProductForEdit>>>
export type VarietalOption = Awaited<ReturnType<typeof listVarietals>>[number]
