import 'server-only'

// Third-party Imports
import { createHash, timingSafeEqual } from 'node:crypto'

// Hashing both sides to a fixed-length digest before comparing avoids
// timingSafeEqual's length-mismatch throw, which would otherwise leak the
// expected password length through the exception path.
const digest = (value: string): Buffer => createHash('sha256').update(value).digest()

export const verifyAdminPassword = (candidate: string): boolean => {
  const expected = process.env.ADMIN_PASSWORD

  if (!expected) {
    throw new Error('ADMIN_PASSWORD is not set. The admin dashboard cannot be signed into until it is.')
  }

  return timingSafeEqual(digest(candidate), digest(expected))
}
