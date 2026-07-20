// Shared by the client field (instant feedback) and the server (authoritative).
// One definition so the two can't drift — the client check is UX only and is
// never trusted.

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024

export const ALLOWED_IMAGE_MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp'
}

export const ALLOWED_IMAGE_MIMES = Object.keys(ALLOWED_IMAGE_MIME_TO_EXT)

export const ACCEPT_ATTRIBUTE = ALLOWED_IMAGE_MIMES.join(',')
