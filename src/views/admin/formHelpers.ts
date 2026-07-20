// Type Imports
import type { FieldErrors } from '@/libs/admin/shared/result'

// Turns a server field-error map into the error/helperText pair every
// CustomTextField needs, so forms don't repeat the same ternary 20 times.
export const fieldProps = (name: string, fieldErrors?: FieldErrors) => ({
  error: Boolean(fieldErrors?.[name]),
  helperText: fieldErrors?.[name]?.[0]
})

// Rows carry a client-side key so React can track them before they have a
// database id. zod strips it on the way back in.
export const newRowKey = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Math.random())
