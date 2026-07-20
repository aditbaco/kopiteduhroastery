// Auth Imports
import { requireAdminSession } from '@/libs/admin/auth/guard'

// Lib Imports
import { listProductsForAdmin } from '@/libs/admin/products/read'

// View Imports
import ProductsTable from '@/views/admin/products/ProductsTable'

const AdminProductsPage = async () => {
  // src/proxy.ts already gates this path; this is the same defense in depth the
  // mutations get, because a matcher is one typo away from letting reads through.
  await requireAdminSession()

  const products = await listProductsForAdmin()

  return <ProductsTable products={products} />
}

export default AdminProductsPage
