'use client'

// React Imports
import { useState, useTransition } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

// Type Imports
import type { AdminProductListItem } from '@/libs/admin/products/read'

// Action Imports
import { deleteProductAction } from '@/app/(dashboard)/admin/products/actions'

// Dictionary Imports
import dict from '@/dictionaries/id'

// Util Imports
import { formatIdr } from '@/utils/format'

type Props = {
  products: AdminProductListItem[]
}

const priceRange = (product: AdminProductListItem): string => {
  if (product.variants.length === 0) {
    return '—'
  }

  const prices = product.variants.map(variant => variant.priceIdr)
  const min = Math.min(...prices)
  const max = Math.max(...prices)

  return min === max ? formatIdr(min) : `${formatIdr(min)} – ${formatIdr(max)}`
}

const ProductsTable = ({ products }: Props) => {
  const [pending, startTransition] = useTransition()
  const [target, setTarget] = useState<AdminProductListItem | null>(null)
  const [error, setError] = useState<string | null>(null)

  const confirmDelete = () => {
    if (!target) {
      return
    }

    startTransition(async () => {
      const result = await deleteProductAction(target.id)

      setTarget(null)

      if (result.formError) {
        setError(result.formError)
      }
    })
  }

  return (
    <Card>
      <CardContent className='flex justify-between items-center gap-4 flex-wrap'>
        <div>
          <Typography variant='h5'>Produk</Typography>
          <Typography variant='body2' color='text.secondary'>
            {products.length} produk di katalog
          </Typography>
        </div>
        <Button
          variant='contained'
          startIcon={<i className='tabler-plus' />}
          component={Link}
          href='/admin/products/new'
        >
          Tambah produk
        </Button>
      </CardContent>

      {error && (
        <Alert severity='error' onClose={() => setError(null)} className='mli-6 mbe-4'>
          {error}
        </Alert>
      )}

      <TableContainer>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Produk</TableCell>
              <TableCell>Jenis</TableCell>
              <TableCell>Harga</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align='right'>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography className='text-center plb-6' color='text.secondary'>
                    Belum ada produk. Tambahkan produk pertama untuk mulai.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {products.map(product => (
              <TableRow key={product.id} hover>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <Box
                      sx={{
                        inlineSize: 36,
                        blockSize: 36,
                        borderRadius: 1,
                        flexShrink: 0,
                        backgroundColor: 'action.hover',
                        backgroundImage: product.heroImage ? `url(${product.heroImage})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <div>
                      <Typography variant='body1' color='text.primary'>
                        {product.name}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        /{product.slug}
                      </Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{dict.species[product.species]}</TableCell>
                <TableCell>{priceRange(product)}</TableCell>
                <TableCell>
                  <div className='flex gap-2 flex-wrap'>
                    <Chip
                      size='small'
                      variant='tonal'
                      color={product.isActive ? 'success' : 'secondary'}
                      label={product.isActive ? 'Aktif' : 'Nonaktif'}
                    />
                    {product.isFeatured && <Chip size='small' variant='tonal' color='primary' label='Unggulan' />}
                  </div>
                </TableCell>
                <TableCell align='right'>
                  <Button size='small' variant='text' component={Link} href={`/admin/products/${product.id}`}>
                    Ubah
                  </Button>
                  <Button size='small' variant='text' color='error' onClick={() => setTarget(product)}>
                    Hapus
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={Boolean(target)} onClose={() => setTarget(null)}>
        <DialogTitle>Hapus produk?</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>{target?.name}</strong> akan dihapus permanen beserta varian, taste notes, dan fotonya. Tindakan ini
            tidak bisa dibatalkan.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant='tonal' color='secondary' onClick={() => setTarget(null)}>
            Batal
          </Button>
          <Button variant='contained' color='error' onClick={confirmDelete} disabled={pending}>
            {pending ? 'Menghapus…' : 'Hapus'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default ProductsTable
