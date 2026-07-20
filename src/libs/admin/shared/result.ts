// Domain functions return a typed Result rather than throwing for expected
// failures (a duplicate slug is not exceptional, it is Tuesday). Only genuine
// bugs throw, so the error boundary stays meaningful.

export type FieldErrors = Record<string, string[]>

export type MutationError =
  | { type: 'validation'; fieldErrors: FieldErrors }
  | { type: 'conflict'; fieldErrors: FieldErrors }
  | { type: 'notFound' }
  | { type: 'unexpected'; message: string }

export type Result<T, E = MutationError> = { ok: true; value: T } | { ok: false; error: E }

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value })

export const err = <E>(error: E): Result<never, E> => ({ ok: false, error })
