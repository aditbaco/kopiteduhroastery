import 'server-only'

// Third-party Imports
import { randomUUID } from 'node:crypto'
import { mkdir, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'

// Type Imports
import type { ImageStorage, UploadedImage } from './types'

// Constraint Imports
import { ALLOWED_IMAGE_MIME_TO_EXT } from './constraints'

const PUBLIC_PREFIX = '/images/products/'

const uploadDir = () => path.join(process.cwd(), 'public', 'images', 'products')

// Caveat worth knowing: files written here are only durable while the app runs
// on a persistent filesystem. Under `output: 'standalone'` or a serverless
// target they will not survive a deploy — that is the day to swap ./index.ts
// over to an object-storage implementation.
export const localImageStorage: ImageStorage = {
  save: async ({ buffer, mimeType }: UploadedImage) => {
    const extension = ALLOWED_IMAGE_MIME_TO_EXT[mimeType]

    if (!extension) {
      throw new Error(`Refusing to store unsupported image type: ${mimeType}`)
    }

    // The client's filename is never used. Generating the name from a UUID plus
    // an extension derived from the validated MIME type sidesteps path
    // traversal and collisions rather than trying to sanitize hostile input.
    const filename = `${randomUUID()}${extension}`

    await mkdir(uploadDir(), { recursive: true })
    await writeFile(path.join(uploadDir(), filename), buffer)

    return `${PUBLIC_PREFIX}${filename}`
  },

  remove: async (storedValue: string | null) => {
    // heroImage is DB-controlled so this should always hold; the check stops a
    // future bug from turning this into an arbitrary-file delete.
    if (!storedValue?.startsWith(PUBLIC_PREFIX)) {
      return
    }

    const filename = path.basename(storedValue)

    try {
      await unlink(path.join(uploadDir(), filename))
    } catch (error) {
      // Already gone is the outcome we wanted. Anything else is logged rather
      // than thrown: failing to tidy a file must not fail the user's save.
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error('Failed to remove product image', storedValue, error)
      }
    }
  }
}
