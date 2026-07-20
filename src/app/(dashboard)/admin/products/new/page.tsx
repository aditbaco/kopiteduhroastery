// Auth Imports
import { requireAdminSession } from '@/libs/admin/auth/guard'

// Lib Imports
import { listVarietals } from '@/libs/admin/products/read'

// Action Imports
import { createProductAction } from '../actions'

// View Imports
import ProductForm from '@/views/admin/products/ProductForm'

const NewProductPage = async () => {
  await requireAdminSession()

  const varietals = await listVarietals()

  return <ProductForm title='Tambah produk' action={createProductAction} varietals={varietals} />
}

export default NewProductPage
