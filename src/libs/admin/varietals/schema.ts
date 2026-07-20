// Third-party Imports
import { z } from 'zod'

// Field Imports
import { optionalText, requiredText, slugText } from '@/libs/admin/shared/fields'

// Varietal is a shared vocabulary rather than per-product copy, so the slug is
// the stable key products are matched on — same rule as the product slug.
export const varietalFormSchema = z.object({
  slug: slugText(),
  name: requiredText('Nama', 191),
  nameEn: optionalText
})

export type VarietalFormInput = z.infer<typeof varietalFormSchema>
