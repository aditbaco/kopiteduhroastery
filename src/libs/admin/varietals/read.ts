import 'server-only'

// Lib Imports
import prisma from '@/libs/prisma'

// Uncached, for the same reason as products/read.ts: this is the editor's own
// view of the table and it must never lag a save. `_count` drives both the
// "dipakai N produk" column and the disabled state on delete.
export const listVarietalsForAdmin = async () =>
  prisma.varietal.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      slug: true,
      name: true,
      nameEn: true,
      _count: { select: { products: true } }
    }
  })

export type AdminVarietal = Awaited<ReturnType<typeof listVarietalsForAdmin>>[number]
