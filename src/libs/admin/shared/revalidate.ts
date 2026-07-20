import 'server-only'

// Next Imports
import { updateTag } from 'next/cache'

// Lib Imports
import { PRODUCTS_TAG } from '@/libs/products'

// updateTag rather than revalidateTag: Next 16 deprecated the single-argument
// revalidateTag, and updateTag is the Server-Action-native form — it expires
// immediately and gives read-your-own-writes, so the admin never sees a stale
// list right after saving. If this ever needs to run outside a Server Action,
// swap to revalidateTag(PRODUCTS_TAG, 'max') here.
export const revalidateProducts = (): void => {
  updateTag(PRODUCTS_TAG)
}
