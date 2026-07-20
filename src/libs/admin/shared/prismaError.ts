// Prisma error shapes, in one place because every mutation module has to read
// them and the useful field is adapter-dependent.

export const isKnownRequestError = (error: unknown): error is { code: string; meta?: unknown } =>
  typeof error === 'object' && error !== null && 'code' in error

// Which unique index blew up. The mariadb driver adapter reports it at
// meta.driverAdapterError.cause.constraint.index (e.g. 'Product_slug_key') and
// leaves meta.target undefined, while other adapters populate meta.target with
// a column list. Serializing the whole meta and matching on keywords covers
// both without depending on a shape that varies by adapter version.
export const constraintText = (error: { meta?: unknown }): string => {
  try {
    return JSON.stringify(error.meta ?? '').toLowerCase()
  } catch {
    return ''
  }
}
