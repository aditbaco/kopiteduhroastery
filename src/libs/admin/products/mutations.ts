import 'server-only'

// Type Imports
import type { Prisma } from '@/generated/prisma/client'
import type { FieldErrors, Result } from '@/libs/admin/shared/result'
import type { ProductFormInput, TastingNoteInput, VariantInput } from './schema'

// Lib Imports
import prisma from '@/libs/prisma'
import { err, ok } from '@/libs/admin/shared/result'
import { constraintText, isKnownRequestError } from '@/libs/admin/shared/prismaError'

type Tx = Prisma.TransactionClient

// What should happen to the product photo. Resolved from the upload itself
// rather than from a submitted path, so a stale or forged form can never point
// a row at a file it does not own — or at one another admin just deleted.
export type HeroImageDecision =
  | { kind: 'keep' }
  | { kind: 'clear' }
  | { kind: 'replace'; path: string }

// Carries the form path of the row that tripped a unique constraint, so a
// duplicate SKU lands on the offending input instead of the top of the form.
class RowConflictError extends Error {
  constructor(
    readonly path: string,
    readonly reason: unknown
  ) {
    super('Row conflict')
  }
}

const scalarsFrom = (input: ProductFormInput, heroImage: string | null) => ({
  heroImage,
  slug: input.slug,
  species: input.species,
  name: input.name,
  nameEn: input.nameEn,
  origin: input.origin,
  regency: input.regency,
  province: input.province,
  altitudeMin: input.altitudeMin,
  altitudeMax: input.altitudeMax,
  process: input.process,
  roastLevel: input.roastLevel,
  shortDesc: input.shortDesc,
  shortDescEn: input.shortDescEn,
  description: input.description,
  descriptionEn: input.descriptionEn,
  producer: input.producer,
  partnerSince: input.partnerSince,
  isActive: input.isActive,
  isFeatured: input.isFeatured,
  sortOrder: input.sortOrder
})

// Exactly one default variant, decided here rather than by a DB constraint —
// the schema has no way to express "at most one true per product".
const normalizeVariants = (variants: VariantInput[]): VariantInput[] => {
  const defaultIndex = variants.findIndex(variant => variant.isDefault)
  const chosen = defaultIndex === -1 ? 0 : defaultIndex

  return variants.map((variant, index) => ({ ...variant, isDefault: index === chosen }))
}

const syncVariants = async (tx: Tx, productId: number, submitted: VariantInput[]) => {
  const existing = await tx.productVariant.findMany({ where: { productId }, select: { id: true } })
  const keptIds = new Set(submitted.map(variant => variant.id).filter(Boolean))
  const removedIds = existing.filter(row => !keptIds.has(row.id)).map(row => row.id)

  if (removedIds.length > 0) {
    await tx.productVariant.deleteMany({ where: { id: { in: removedIds } } })
  }

  // Sequential rather than createMany: a P2002 then belongs to a known index,
  // which is what lets the error land on the right row. At 2-4 variants per
  // product the extra round trips cost nothing.
  for (const [index, variant] of submitted.entries()) {
    const data = {
      weightG: variant.weightG,
      priceIdr: variant.priceIdr,
      sku: variant.sku,
      isDefault: variant.isDefault,
      isActive: variant.isActive,
      sortOrder: variant.sortOrder
    }

    try {
      if (variant.id) {
        // Scoped by productId, not just id: the row ids arrive inside a
        // client-supplied JSON blob, so an unscoped update would let a forged
        // id overwrite a variant belonging to a different product.
        const { count } = await tx.productVariant.updateMany({ where: { id: variant.id, productId }, data })

        if (count !== 1) {
          throw new RowConflictError(`variants.${index}`, { code: 'P2025' })
        }
      } else {
        await tx.productVariant.create({ data: { ...data, productId } })
      }
    } catch (error) {
      throw error instanceof RowConflictError ? error : new RowConflictError(`variants.${index}`, error)
    }
  }
}

const syncTastingNotes = async (tx: Tx, productId: number, submitted: TastingNoteInput[]) => {
  const existing = await tx.tastingNote.findMany({ where: { productId }, select: { id: true } })
  const keptIds = new Set(submitted.map(note => note.id).filter(Boolean))
  const removedIds = existing.filter(row => !keptIds.has(row.id)).map(row => row.id)

  if (removedIds.length > 0) {
    await tx.tastingNote.deleteMany({ where: { id: { in: removedIds } } })
  }

  for (const note of submitted) {
    const data = { label: note.label, labelEn: note.labelEn, sortOrder: note.sortOrder }

    if (note.id) {
      // Scoped by productId for the same reason as variants above.
      const { count } = await tx.tastingNote.updateMany({ where: { id: note.id, productId }, data })

      if (count !== 1) {
        throw new RowConflictError('tastingNotes', { code: 'P2025' })
      }
    } else {
      await tx.tastingNote.create({ data: { ...data, productId } })
    }
  }
}

// Full replace, not a diff: ProductVarietal carries nothing beyond its composite
// key, so there is no row identity worth preserving and a diff would land on the
// same end state via more code.
const syncVarietals = async (tx: Tx, productId: number, varietalIds: number[]) => {
  await tx.productVarietal.deleteMany({ where: { productId } })

  if (varietalIds.length > 0) {
    await tx.productVarietal.createMany({
      data: varietalIds.map(varietalId => ({ productId, varietalId })),
      skipDuplicates: true
    })
  }
}

const conflictFieldErrors = (error: unknown, pathPrefix?: string): FieldErrors | null => {
  if (!isKnownRequestError(error) || error.code !== 'P2002') {
    return null
  }

  const target = constraintText(error)

  if (pathPrefix) {
    if (target.includes('weight')) {
      return { [`${pathPrefix}.weightG`]: ['Berat ini sudah dipakai varian lain di produk ini'] }
    }

    return { [`${pathPrefix}.sku`]: ['SKU ini sudah dipakai produk lain'] }
  }

  if (target.includes('slug')) {
    return { slug: ['Slug ini sudah dipakai produk lain'] }
  }

  // Rendered as a form-level alert, so an unrecognised constraint still says
  // something rather than leaving the form apparently inert.
  return { _form: ['Data ini bentrok dengan produk yang sudah ada'] }
}

const toMutationError = (error: unknown): Result<never> => {
  const rowError = error instanceof RowConflictError ? error : null
  const cause = rowError ? rowError.reason : error
  const fieldErrors = conflictFieldErrors(cause, rowError?.path)

  if (fieldErrors) {
    return err({ type: 'conflict', fieldErrors })
  }

  if (isKnownRequestError(cause) && cause.code === 'P2025') {
    return err({ type: 'notFound' })
  }

  console.error('Product mutation failed', error)

  return err({ type: 'unexpected', message: 'Terjadi kesalahan saat menyimpan. Coba lagi.' })
}

export const createProduct = async (
  input: ProductFormInput,
  hero: HeroImageDecision
): Promise<Result<{ id: number }>> => {
  try {
    const product = await prisma.$transaction(async tx => {
      const created = await tx.product.create({
        data: scalarsFrom(input, hero.kind === 'replace' ? hero.path : null)
      })

      await syncVariants(tx, created.id, normalizeVariants(input.variants))
      await syncTastingNotes(tx, created.id, input.tastingNotes)
      await syncVarietals(tx, created.id, input.varietalIds)

      return created
    })

    return ok({ id: product.id })
  } catch (error) {
    return toMutationError(error)
  }
}

export const updateProduct = async (
  id: number,
  input: ProductFormInput,
  hero: HeroImageDecision
): Promise<Result<{ id: number; previousHeroImage: string | null; heroImage: string | null }>> => {
  try {
    const previous = await prisma.product.findUnique({ where: { id }, select: { heroImage: true } })

    if (!previous) {
      return err({ type: 'notFound' })
    }

    // 'keep' resolves against the row as it is right now, not against whatever
    // the form was rendered with — otherwise a stale tab would resurrect a path
    // whose file another admin has already deleted.
    const heroImage =
      hero.kind === 'replace' ? hero.path : hero.kind === 'clear' ? null : previous.heroImage

    await prisma.$transaction(async tx => {
      await tx.product.update({ where: { id }, data: scalarsFrom(input, heroImage) })
      await syncVariants(tx, id, normalizeVariants(input.variants))
      await syncTastingNotes(tx, id, input.tastingNotes)
      await syncVarietals(tx, id, input.varietalIds)
    })

    return ok({ id, previousHeroImage: previous.heroImage, heroImage })
  } catch (error) {
    return toMutationError(error)
  }
}

// Children (variants, tasting notes, varietal links) go via onDelete: Cascade.
export const deleteProduct = async (id: number): Promise<Result<{ heroImage: string | null }>> => {
  try {
    const deleted = await prisma.product.delete({ where: { id }, select: { heroImage: true } })

    return ok({ heroImage: deleted.heroImage })
  } catch (error) {
    return toMutationError(error)
  }
}
