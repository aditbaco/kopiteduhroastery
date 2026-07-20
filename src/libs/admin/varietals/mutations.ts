import 'server-only'

// Type Imports
import type { Result } from '@/libs/admin/shared/result'
import type { VarietalFormInput } from './schema'

// Lib Imports
import prisma from '@/libs/prisma'
import { err, ok } from '@/libs/admin/shared/result'
import { constraintText, isKnownRequestError } from '@/libs/admin/shared/prismaError'

const toMutationError = (error: unknown): Result<never> => {
  if (isKnownRequestError(error) && error.code === 'P2002') {
    if (constraintText(error).includes('slug')) {
      return err({ type: 'conflict', fieldErrors: { slug: ['Slug ini sudah dipakai varietas lain'] } })
    }

    return err({ type: 'conflict', fieldErrors: { _form: ['Data ini bentrok dengan varietas yang sudah ada'] } })
  }

  if (isKnownRequestError(error) && error.code === 'P2025') {
    return err({ type: 'notFound' })
  }

  return err({ type: 'unexpected', message: 'Gagal menyimpan varietas' })
}

export const createVarietal = async (input: VarietalFormInput): Promise<Result<{ id: number }>> => {
  try {
    const created = await prisma.varietal.create({ data: input, select: { id: true } })

    return ok(created)
  } catch (error) {
    return toMutationError(error)
  }
}

export const updateVarietal = async (id: number, input: VarietalFormInput): Promise<Result<{ id: number }>> => {
  try {
    const updated = await prisma.varietal.update({ where: { id }, data: input, select: { id: true } })

    return ok(updated)
  } catch (error) {
    return toMutationError(error)
  }
}

/*
 * ProductVarietal.varietal is `onDelete: Cascade`, so an unguarded delete would
 * silently strip this varietal from every product using it. The link count is
 * therefore a hard gate, not a UI warning — the table's disabled delete button
 * is a convenience, this is the rule.
 *
 * Count and delete run in one transaction so a link created mid-request cannot
 * slip past the check. That still is not fully serialisable under MariaDB's
 * default isolation, but this is a single-editor tool and the failure mode is
 * one link lost, not silent corruption of unrelated rows.
 */
export const deleteVarietal = async (id: number): Promise<Result<null>> => {
  try {
    return await prisma.$transaction(async tx => {
      const inUse = await tx.productVarietal.count({ where: { varietalId: id } })

      if (inUse > 0) {
        return err({
          type: 'conflict' as const,
          fieldErrors: {
            _form: [`Varietas ini dipakai ${inUse} produk. Lepaskan dari produk tersebut sebelum menghapus.`]
          }
        })
      }

      await tx.varietal.delete({ where: { id } })

      return ok(null)
    })
  } catch (error) {
    return toMutationError(error)
  }
}
