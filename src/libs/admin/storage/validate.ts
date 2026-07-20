import 'server-only'

// Type Imports
import type { UploadedImage } from './types'

// Constraint Imports
import { ALLOWED_IMAGE_MIME_TO_EXT, MAX_IMAGE_BYTES } from './constraints'

// file.type is client-supplied, so it is a hint, not evidence. Sniffing the
// leading bytes stops a renamed .exe from being stored as .png.
const sniffMimeType = (bytes: Uint8Array): string | null => {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg'
  }

  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

  if (bytes.length >= 8 && png.every((byte, index) => bytes[index] === byte)) {
    return 'image/png'
  }

  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end))

  if (bytes.length >= 12 && ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') {
    return 'image/webp'
  }

  return null
}

export type UploadValidation = { ok: true; value: UploadedImage } | { ok: false; message: string }

export const validateImageUpload = async (file: File): Promise<UploadValidation> => {
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, message: `Ukuran gambar maksimal ${Math.round(MAX_IMAGE_BYTES / (1024 * 1024))}MB` }
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const sniffed = sniffMimeType(buffer)

  if (!sniffed || !ALLOWED_IMAGE_MIME_TO_EXT[sniffed]) {
    return { ok: false, message: 'Format gambar harus JPG, PNG, atau WebP' }
  }

  return { ok: true, value: { buffer, mimeType: sniffed } }
}
