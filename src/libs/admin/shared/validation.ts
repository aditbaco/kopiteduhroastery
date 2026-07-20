// Third-party Imports
import type { ZodError } from 'zod'

// Type Imports
import type { FieldErrors } from './result'

// zod's flattenError only reaches one level deep, which loses the array index
// on nested rows. Building the map from issue.path instead yields keys like
// `variants.1.sku` — exactly what the repeatable row editors look up.
export const fieldErrorsFromZod = (error: ZodError): FieldErrors => {
  const fieldErrors: FieldErrors = {}

  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join('.') : '_form'

    fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message]
  }

  return fieldErrors
}

// Arrays ride in the form as a single JSON string under a well-known key rather
// than as indexed FormData entries (variants[0][sku]), which keeps the server
// side to one JSON.parse instead of bespoke reconstruction logic.
export const readJsonField = (formData: FormData, key: string): unknown => {
  const raw = formData.get(key)

  if (typeof raw !== 'string' || raw.trim() === '') {
    return []
  }

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}
