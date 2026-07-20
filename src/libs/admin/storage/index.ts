// Type Imports
import type { ImageStorage } from './types'

// Storage Imports
import { localImageStorage } from './localImageStorage'

// The single line that changes when uploads move to object storage.
export const imageStorage: ImageStorage = localImageStorage
