// Row shapes held in form state. Numeric fields stay strings while being typed —
// zod coerces them server-side — so a half-typed "12" never becomes NaN.

export type VariantRow = {
  key: string
  id?: number
  weightG: string
  priceIdr: string
  sku: string
  isDefault: boolean
  isActive: boolean
  sortOrder: string
}

export type TastingNoteRow = {
  key: string
  id?: number
  label: string
  labelEn: string
  sortOrder: string
}
