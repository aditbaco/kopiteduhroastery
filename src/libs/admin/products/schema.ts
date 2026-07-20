// Third-party Imports
import { z } from 'zod'

// Enum Imports
import { Process, RoastLevel, Species } from '@/generated/prisma/enums'

// Field Imports
import { optionalText, requiredText, slugText } from '@/libs/admin/shared/fields'

// Accepts either a real boolean (arrays arrive as JSON, which preserves them)
// or the literal strings the hidden switch inputs emit. Deliberately not
// z.coerce.boolean(), which treats the string 'false' as true.
const booleanish = z.union([z.boolean(), z.enum(['true', 'false']).transform(value => value === 'true')])

export const variantSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  weightG: z.coerce.number().int().positive('Berat harus lebih dari 0'),
  priceIdr: z.coerce.number().int().nonnegative('Harga tidak boleh negatif'),
  sku: requiredText('SKU', 64),
  isDefault: booleanish,
  isActive: booleanish,
  sortOrder: z.coerce.number().int().default(0)
})

export const tastingNoteSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  label: requiredText('Taste notes', 191),
  labelEn: optionalText,
  sortOrder: z.coerce.number().int().default(0)
})

export const productFormSchema = z
  .object({
    slug: slugText(),
    species: z.enum(Species),
    name: requiredText('Nama', 191),
    nameEn: optionalText,
    origin: requiredText('Asal', 191),
    regency: requiredText('Kabupaten', 191),
    province: requiredText('Provinsi', 191),
    altitudeMin: z.coerce.number().int().nonnegative('Ketinggian tidak boleh negatif'),
    altitudeMax: z.coerce.number().int().nonnegative('Ketinggian tidak boleh negatif'),
    process: z.enum(Process),
    roastLevel: z.enum(RoastLevel),
    shortDesc: optionalText.pipe(z.string().max(255, 'Deskripsi singkat maksimal 255 karakter').nullable()),
    shortDescEn: optionalText.pipe(z.string().max(255, 'Deskripsi singkat maksimal 255 karakter').nullable()),
    description: requiredText('Deskripsi', 20000),
    descriptionEn: optionalText,
    producer: optionalText,
    partnerSince: z.coerce.number().int().min(1900).max(2200).nullable().catch(null),

    // heroImage is deliberately absent: it is resolved server-side from the
    // upload plus the row's existing value, never taken from the submitted form.
    isActive: booleanish,
    isFeatured: booleanish,
    sortOrder: z.coerce.number().int().default(0),
    varietalIds: z.array(z.coerce.number().int().positive()).default([]),
    tastingNotes: z.array(tastingNoteSchema).default([]),

    // A product with no variant has no price, so the storefront would render it
    // with a blank price tag and no way to buy it. Enforced here rather than in
    // the schema because it is a business rule, not a data-integrity one.
    variants: z.array(variantSchema).min(1, 'Minimal satu varian (berat + harga) diperlukan')
  })
  .superRefine((value, ctx) => {
    if (value.altitudeMax < value.altitudeMin) {
      ctx.addIssue({
        code: 'custom',
        path: ['altitudeMax'],
        message: 'Ketinggian maksimum tidak boleh lebih kecil dari minimum'
      })
    }

    // Catch duplicates inside the submitted set before the database does, so the
    // error can name the offending row instead of surfacing a bare P2002.
    const seenWeights = new Map<number, number>()
    const seenSkus = new Map<string, number>()

    value.variants.forEach((variant, index) => {
      if (seenWeights.has(variant.weightG)) {
        ctx.addIssue({
          code: 'custom',
          path: ['variants', index, 'weightG'],
          message: 'Berat ini sudah dipakai varian lain'
        })
      }

      seenWeights.set(variant.weightG, index)

      const sku = variant.sku.toLowerCase()

      if (seenSkus.has(sku)) {
        ctx.addIssue({ code: 'custom', path: ['variants', index, 'sku'], message: 'SKU ini sudah dipakai varian lain' })
      }

      seenSkus.set(sku, index)
    })
  })

export type ProductFormInput = z.infer<typeof productFormSchema>
export type VariantInput = z.infer<typeof variantSchema>
export type TastingNoteInput = z.infer<typeof tastingNoteSchema>
