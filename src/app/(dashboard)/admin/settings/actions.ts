'use server'

// Next Imports
import { revalidatePath } from 'next/cache'

// Type Imports
import type { FieldErrors, MutationError } from '@/libs/admin/shared/result'

// Auth Imports
import { requireAdminSession } from '@/libs/admin/auth/guard'

// Domain Imports
import { varietalFormSchema } from '@/libs/admin/varietals/schema'
import { createVarietal, deleteVarietal, updateVarietal } from '@/libs/admin/varietals/mutations'

// Util Imports
import { fieldErrorsFromZod } from '@/libs/admin/shared/validation'
import { revalidateProducts } from '@/libs/admin/shared/revalidate'

export type VarietalFormState = { fieldErrors?: FieldErrors; formError?: string; savedAt?: number }

const SETTINGS_PATH = '/admin/settings'

const toFormState = (error: MutationError): VarietalFormState => {
  switch (error.type) {
    case 'validation':
    case 'conflict':
      return { fieldErrors: error.fieldErrors }
    case 'notFound':
      return { formError: 'Varietas ini sudah tidak ada. Muat ulang halaman.' }
    default:
      return { formError: error.message }
  }
}

/*
 * Varietals are embedded in every product page through `productInclude`, so a
 * rename has to expire the storefront cache as well as re-render this page.
 * revalidatePath is explicit here rather than relying on the router refresh a
 * Server Action already triggers — the list is read uncached, and being
 * explicit means a future move to a cached read does not silently go stale.
 */
const revalidateAll = () => {
  revalidateProducts()
  revalidatePath(SETTINGS_PATH)
}

// `id` is bound by the caller, never read from the form — the same rule the
// product editor follows, so a forged field cannot retarget the write.
export const saveVarietalAction = async (
  id: number | null,
  _state: VarietalFormState,
  formData: FormData
): Promise<VarietalFormState> => {
  await requireAdminSession()

  const parsed = varietalFormSchema.safeParse({
    slug: formData.get('slug') ?? '',
    name: formData.get('name') ?? '',
    nameEn: formData.get('nameEn') ?? ''
  })

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) }
  }

  const result = id === null ? await createVarietal(parsed.data) : await updateVarietal(id, parsed.data)

  if (!result.ok) {
    return toFormState(result.error)
  }

  revalidateAll()

  // A changing timestamp rather than `ok: true`: the dialog needs to react to
  // every successful save, and a boolean that is already true does not change.
  return { savedAt: Date.now() }
}

export const deleteVarietalAction = async (id: number): Promise<VarietalFormState> => {
  await requireAdminSession()

  const result = await deleteVarietal(id)

  if (!result.ok) {
    return toFormState(result.error)
  }

  revalidateAll()

  return { savedAt: Date.now() }
}
