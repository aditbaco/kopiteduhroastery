// Third-party Imports
import { createHmac, timingSafeEqual } from 'node:crypto'

// Config Imports
import { SESSION_TTL_SECONDS, getSessionSecret } from './config'

// The cookie carries no identity — there is one shared admin password, so the
// only thing worth signing is an expiry. Format: `<expiresAtMs>.<hmac>`.
//
// node:crypto is safe here because Next 16's proxy.ts always runs on the Node
// runtime (edge is not supported there), and so do Server Actions.

const sign = (payload: string): string => createHmac('sha256', getSessionSecret()).update(payload).digest('hex')

export const createSessionValue = (): string => {
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000

  return `${expiresAt}.${sign(String(expiresAt))}`
}

export const verifySessionValue = (value: string | undefined): boolean => {
  if (!value) {
    return false
  }

  const separator = value.indexOf('.')

  if (separator <= 0) {
    return false
  }

  const payload = value.slice(0, separator)
  const signature = value.slice(separator + 1)
  const expected = sign(payload)

  // timingSafeEqual throws on length mismatch, so screen for that first — a
  // wrong-length signature is a forgery regardless.
  if (signature.length !== expected.length) {
    return false
  }

  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return false
  }

  const expiresAt = Number(payload)

  return Number.isFinite(expiresAt) && expiresAt > Date.now()
}
