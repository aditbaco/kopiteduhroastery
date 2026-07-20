// Next Imports
import { notFound } from 'next/navigation'

// Auth Imports
import { requireAdminSession } from '@/libs/admin/auth/guard'

// Lib Imports
import { getProductForEdit, listVarietals } from '@/libs/admin/products/read'

// Action Imports
import { updateProductAction } from '../actions'

// View Imports
import ProductForm from '@/views/admin/products/ProductForm'

type Props = {
  params: Promise<{ id: string }>
}

const EditProductPage = async ({ params }: Props) => {
  await requireAdminSession()

  const { id } = await params
  const productId = Number(id)

  if (!Number.isInteger(productId) || productId <= 0) {
    notFound()
  }

  const [product, varietals] = await Promise.all([getProductForEdit(productId), listVarietals()])

  if (!product) {
    notFound()
  }

  return (
    <ProductForm
      title='Ubah produk'
      action={updateProductAction.bind(null, productId)}
      varietals={varietals}
      product={product}
    />
  )
}

export default EditProductPage
