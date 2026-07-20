'use server'

// Next Imports
import { redirect } from 'next/navigation'

// Type Imports
import type { HeroImageDecision } from '@/libs/admin/products/mutations'
import type { ProductFormInput } from '@/libs/admin/products/schema'
import type { FieldErrors, Result } from '@/libs/admin/shared/result'

// Auth Imports
import { requireAdminSession } from '@/libs/admin/auth/guard'

// Domain Imports
import { productFormSchema } from '@/libs/admin/products/schema'
import { createProduct, deleteProduct, updateProduct } from '@/libs/admin/products/mutations'

// Storage Imports
import { imageStorage } from '@/libs/admin/storage'
import { validateImageUpload } from '@/libs/admin/storage/validate'

// Util Imports
import { fieldErrorsFromZod, readJsonField } from '@/libs/admin/shared/validation'
import { revalidateProducts } from '@/libs/admin/shared/revalidate'

export type ProductFormState = { fieldErrors?: FieldErrors; formError?: string }

const SCALAR_FIELDS = [
  'slug',
  'species',
  'name',
  'nameEn',
  'origin',
  'regency',
  'province',
  'altitudeMin',
  'altitudeMax',
  'process',
  'roastLevel',
  'shortDesc',
  'shortDescEn',
  'description',
  'descriptionEn',
  'producer',
  'partnerSince',
  'isActive',
  'isFeatured',
  'sortOrder'
]

// Scalars ride flat; the three collections ride as JSON strings.
const parseForm = (formData: FormData) =>
  productFormSchema.safeParse({
    ...Object.fromEntries(SCALAR_FIELDS.map(key => [key, formData.get(key) ?? ''])),
    varietalIds: readJsonField(formData, 'varietalIds'),
    tastingNotes: readJsonField(formData, 'tastingNotes'),
    variants: readJsonField(formData, 'variants')
  })

type HeroOutcome = { decision: HeroImageDecision; uploaded: string | null } | { error: string }

// Note what is absent: the caller never tells us the existing path. Keeping an
// image is expressed as intent ('keep'), and the domain resolves it against the
// live row, so a stale form cannot write back a path that is no longer valid.
const resolveHeroImage = async (formData: FormData): Promise<HeroOutcome> => {
  if (formData.get('removeHeroImage') === 'true') {
    return { decision: { kind: 'clear' }, uploaded: null }
  }

  const file = formData.get('heroImageFile')

  if (!(file instanceof File) || file.size === 0) {
    return { decision: { kind: 'keep' }, uploaded: null }
  }

  const validated = await validateImageUpload(file)

  if (!validated.ok) {
    return { error: validated.message }
  }

  const path = await imageStorage.save(validated.value)

  return { decision: { kind: 'replace', path }, uploaded: path }
}

const toFormState = (error: Extract<Result<unknown>, { ok: false }>['error']): ProductFormState => {
  if (error.type === 'notFound') {
    return { formError: 'Produk tidak ditemukan. Mungkin sudah dihapus atau diubah orang lain.' }
  }

  if (error.type === 'unexpected') {
    return { formError: error.message }
  }

  return { fieldErrors: error.fieldErrors }
}

type SaveResult = Result<{ id: number; previousHeroImage?: string | null; heroImage?: string | null }>

// Shared spine for create and edit: guard, validate, upload, persist, tidy up.
// The two differ only in which save they hand over to.
const submitProductForm = async (
  formData: FormData,
  save: (input: ProductFormInput, hero: HeroImageDecision) => Promise<SaveResult>
): Promise<ProductFormState> => {
  await requireAdminSession()

  // Validate before touching the filesystem, so a rejected form never uploads.
  const parsed = parseForm(formData)

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) }
  }

  const hero = await resolveHeroImage(formData)

  if ('error' in hero) {
    return { fieldErrors: { heroImage: [hero.error] } }
  }

  const result = await save(parsed.data, hero.decision)

  if (!result.ok) {
    // The row never landed, so the file it would have pointed at is garbage.
    await imageStorage.remove(hero.uploaded)

    return toFormState(result.error)
  }

  // Only after the row is committed. An orphaned file is harmless; a row
  // pointing at a file we already deleted is a visible broken image.
  const { previousHeroImage, heroImage } = result.value

  if (previousHeroImage && previousHeroImage !== heroImage) {
    await imageStorage.remove(previousHeroImage)
  }

  revalidateProducts()

  redirect('/admin/products')
}

export const createProductAction = async (
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> => submitProductForm(formData, createProduct)

export const updateProductAction = async (
  id: number,
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> => submitProductForm(formData, (input, hero) => updateProduct(id, input, hero))

export const deleteProductAction = async (id: number): Promise<{ formError?: string }> => {
  await requireAdminSession()

  const result = await deleteProduct(id)

  if (!result.ok) {
    return { formError: result.error.type === 'notFound' ? 'Produk sudah dihapus' : 'Gagal menghapus produk' }
  }

  await imageStorage.remove(result.value.heroImage)

  revalidateProducts()

  return {}
}
